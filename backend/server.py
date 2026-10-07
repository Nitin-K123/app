from fastapi import FastAPI, APIRouter, Depends, HTTPException, UploadFile, File, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import base64
import logging
from pathlib import Path
from typing import Optional, List

from models import (
    UserCreate, UserLogin, UserPublic,
    ProductCreate, Product,
    EnquiryCreate, Enquiry,
    Supplier, uid,
)
from auth_utils import (
    hash_password, verify_password, create_token,
    current_user, optional_user,
)
from seed_data import SEED_SUPPLIERS, SEED_PRODUCTS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Product Search India API")
api = APIRouter(prefix="/api")

logger = logging.getLogger("psi")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


# ------------- helpers -------------
def _public_user(u: dict) -> dict:
    return {
        "id": u["id"], "email": u["email"], "name": u["name"], "role": u["role"],
        "company": u.get("company"), "phone": u.get("phone"),
        "city": u.get("city"), "state": u.get("state"),
    }


def _clean(doc: dict) -> dict:
    if not doc:
        return doc
    doc.pop("_id", None)
    doc.pop("password_hash", None)
    return doc


# ------------- auth -------------
@api.post("/auth/register")
async def register(payload: UserCreate):
    existing = await db.users.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(400, "An account with this email already exists")
    user = {
        "id": uid(),
        "email": payload.email.lower(),
        "password_hash": hash_password(payload.password),
        "name": payload.name,
        "role": payload.role if payload.role in ("buyer", "seller") else "buyer",
        "company": payload.company or "",
        "phone": payload.phone or "",
        "city": payload.city or "",
        "state": payload.state or "",
    }
    await db.users.insert_one(user)
    if user["role"] == "seller":
        supplier = Supplier(user_id=user["id"], company=user["company"] or user["name"], city=user["city"], state=user["state"], verified=False).model_dump()
        await db.suppliers.insert_one(supplier)
    token = create_token(user["id"], user["role"])
    return {"token": token, "user": _public_user(user)}


@api.post("/auth/login")
async def login(payload: UserLogin):
    u = await db.users.find_one({"email": payload.email.lower()})
    if not u or not verify_password(payload.password, u["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    token = create_token(u["id"], u["role"])
    return {"token": token, "user": _public_user(u)}


@api.get("/auth/me")
async def me(claims: dict = Depends(current_user)):
    u = await db.users.find_one({"id": claims["sub"]})
    if not u:
        raise HTTPException(404, "User not found")
    return {"user": _public_user(u)}


# ------------- uploads (base64) -------------
@api.post("/uploads")
async def upload(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "Only image uploads are allowed")
    data = await file.read()
    if len(data) > 3 * 1024 * 1024:
        raise HTTPException(413, "Image too large (max 3MB)")
    b64 = base64.b64encode(data).decode("ascii")
    url = f"data:{file.content_type};base64,{b64}"
    return {"url": url, "size": len(data), "content_type": file.content_type}


# ------------- products -------------
@api.get("/products/featured")
async def featured_products():
    items = await db.products.find({}).sort("created_at", -1).limit(10).to_list(10)
    return [_clean(i) for i in items]


@api.get("/products/mine")
async def my_products(claims: dict = Depends(current_user)):
    items = await db.products.find({"seller_id": claims["sub"]}).sort("created_at", -1).to_list(500)
    return [_clean(i) for i in items]


@api.get("/products")
async def list_products(
    q: Optional[str] = None,
    category: Optional[str] = None,
    city: Optional[str] = None,
    verified: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort: Optional[str] = "newest",
    limit: int = Query(60, le=200),
):
    f: dict = {}
    if q:
        f["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"seller_company": {"$regex": q, "$options": "i"}},
            {"category": {"$regex": q, "$options": "i"}},
        ]
    if category:
        f["category"] = category
    if city:
        f["city"] = {"$regex": city, "$options": "i"}
    if verified is True:
        f["verified"] = True
    price_f: dict = {}
    if min_price is not None:
        price_f["$gte"] = min_price
    if max_price is not None:
        price_f["$lte"] = max_price
    if price_f:
        f["price"] = price_f

    cur = db.products.find(f)
    if sort == "price_low":
        cur = cur.sort("price", 1)
    elif sort == "price_high":
        cur = cur.sort("price", -1)
    else:
        cur = cur.sort("created_at", -1)
    items = await cur.to_list(limit)
    return [_clean(i) for i in items]


@api.get("/products/{pid}")
async def get_product(pid: str):
    p = await db.products.find_one({"id": pid})
    if not p:
        raise HTTPException(404, "Product not found")
    supplier = await db.suppliers.find_one({"user_id": p["seller_id"]})
    return {"product": _clean(p), "supplier": _clean(supplier) if supplier else None}


@api.post("/products")
async def create_product(payload: ProductCreate, claims: dict = Depends(current_user)):
    if claims.get("role") != "seller":
        raise HTTPException(403, "Only sellers can list products")
    supplier = await db.suppliers.find_one({"user_id": claims["sub"]})
    seller_company = supplier["company"] if supplier else ""
    prod = Product(
        **payload.model_dump(),
        seller_id=claims["sub"],
        seller_company=seller_company,
        verified=bool(supplier and supplier.get("verified")),
    ).model_dump()
    await db.products.insert_one(prod)
    return _clean(prod)


@api.delete("/products/{pid}")
async def delete_product(pid: str, claims: dict = Depends(current_user)):
    p = await db.products.find_one({"id": pid})
    if not p:
        raise HTTPException(404, "Product not found")
    if p["seller_id"] != claims["sub"]:
        raise HTTPException(403, "Not your product")
    await db.products.delete_one({"id": pid})
    return {"ok": True}


# ------------- suppliers -------------
@api.get("/suppliers/{sid}")
async def get_supplier(sid: str):
    s = await db.suppliers.find_one({"$or": [{"id": sid}, {"user_id": sid}]})
    if not s:
        raise HTTPException(404, "Supplier not found")
    user = await db.users.find_one({"id": s["user_id"]})
    products = await db.products.find({"seller_id": s["user_id"]}).sort("created_at", -1).to_list(100)
    return {
        "supplier": _clean(s),
        "user": _public_user(user) if user else None,
        "products": [_clean(p) for p in products],
        "stats": {
            "product_count": len(products),
            "categories": sorted({p.get("category", "") for p in products if p.get("category")}),
        },
    }


# ------------- enquiries -------------
@api.post("/enquiries")
async def post_enquiry(payload: EnquiryCreate):
    p = await db.products.find_one({"id": payload.product_id})
    if not p:
        raise HTTPException(404, "Product not found")
    e = Enquiry(
        **payload.model_dump(),
        product_name=p["name"],
        seller_id=p["seller_id"],
    ).model_dump()
    await db.enquiries.insert_one(e)
    return {"ok": True, "id": e["id"]}


@api.get("/enquiries/mine")
async def my_enquiries(claims: dict = Depends(current_user)):
    items = await db.enquiries.find({"seller_id": claims["sub"]}).sort("created_at", -1).to_list(500)
    return [_clean(i) for i in items]


# ------------- seed -------------
@api.post("/seed")
async def seed(force: bool = False):
    existing = await db.products.count_documents({})
    if existing > 0 and not force:
        return {"ok": True, "message": f"Already seeded ({existing} products)."}

    if force:
        await db.products.delete_many({})
        await db.suppliers.delete_many({})
        await db.users.delete_many({"email": {"$regex": "@psi-demo.in$"}})

    email_to_user_id: dict = {}
    for s in SEED_SUPPLIERS:
        user = {
            "id": uid(),
            "email": s["email"],
            "password_hash": hash_password("demo1234"),
            "name": s["name"],
            "role": "seller",
            "company": s["company"],
            "phone": "+91 98765 43210",
            "city": s["city"],
            "state": s["state"],
        }
        await db.users.insert_one(user)
        email_to_user_id[s["email"]] = user["id"]
        supplier = Supplier(
            user_id=user["id"], company=s["company"], city=s["city"], state=s["state"],
            year_established=s["year_established"], gst=s["gst"],
            annual_turnover=s["annual_turnover"], employees=s["employees"],
            certifications=s["certifications"], response_rate=s["response_rate"],
            response_time=s["response_time"], rating=s["rating"], reviews=s["reviews"],
            cover_image=s["cover_image"], about=s["about"], verified=s["verified"],
        ).model_dump()
        await db.suppliers.insert_one(supplier)

    for p in SEED_PRODUCTS:
        seller_id = email_to_user_id.get(p["supplier_email"])
        if not seller_id:
            continue
        sup = next((x for x in SEED_SUPPLIERS if x["email"] == p["supplier_email"]), None)
        prod = Product(
            name=p["name"], category=p["category"], subcategory=p.get("subcategory", ""),
            price=p["price"], unit=p["unit"], moq=p["moq"], brand=p.get("brand", ""),
            gst=p.get("gst", ""), hsn=p.get("hsn", ""), city=p.get("city", ""),
            state=p.get("state", ""), description=p.get("description", ""),
            images=p.get("images", []),
            seller_id=seller_id,
            seller_company=sup["company"] if sup else "",
            verified=bool(sup and sup["verified"]),
        ).model_dump()
        await db.products.insert_one(prod)

    return {"ok": True, "suppliers": len(SEED_SUPPLIERS), "products": len(SEED_PRODUCTS)}


@api.get("/")
async def root():
    return {"service": "Product Search India", "status": "ok"}


# Mount
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    # ensure indexes
    try:
        await db.users.create_index("email", unique=True)
        await db.products.create_index("seller_id")
        await db.products.create_index("category")
    except Exception as e:
        logger.warning(f"index create failed: {e}")

    # auto-seed on first boot
    try:
        count = await db.products.count_documents({})
        if count == 0:
            logger.info("Auto-seeding demo data...")
            await seed(force=False)
    except Exception as e:
        logger.warning(f"auto-seed failed: {e}")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
