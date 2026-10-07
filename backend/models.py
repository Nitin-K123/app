from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid


def uid() -> str:
    return str(uuid.uuid4())


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "buyer"  # buyer | seller
    company: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    id: str
    email: str
    name: str
    role: str
    company: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None


class Supplier(BaseModel):
    id: str = Field(default_factory=uid)
    user_id: str
    company: str
    city: str = ""
    state: str = ""
    year_established: int = 2015
    gst: str = ""
    annual_turnover: str = "₹ 10 - 25 Crore"
    employees: str = "50-100"
    certifications: List[str] = Field(default_factory=lambda: ["ISO 9001:2015"])
    response_rate: str = "94%"
    response_time: str = "Within 3 hours"
    rating: float = 4.5
    reviews: int = 120
    cover_image: str = ""
    about: str = ""
    verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ProductCreate(BaseModel):
    name: str
    category: str
    subcategory: Optional[str] = ""
    price: float
    unit: str = "Piece"
    moq: str = "1"
    brand: Optional[str] = ""
    gst: Optional[str] = ""
    hsn: Optional[str] = ""
    city: Optional[str] = ""
    state: Optional[str] = ""
    description: Optional[str] = ""
    images: List[str] = Field(default_factory=list)


class Product(ProductCreate):
    id: str = Field(default_factory=uid)
    seller_id: str
    seller_company: str = ""
    verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


class EnquiryCreate(BaseModel):
    product_id: str
    buyer_name: str
    buyer_email: Optional[str] = ""
    buyer_phone: str
    qty: Optional[str] = ""
    message: Optional[str] = ""


class Enquiry(EnquiryCreate):
    id: str = Field(default_factory=uid)
    product_name: str = ""
    seller_id: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
