#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Product Search India B2B Portal
Tests all 16 endpoints against the external URL
"""

import requests
import json
import sys
import os
import random
import string
from typing import Dict, Any, Optional
import base64
from io import BytesIO
from PIL import Image

# Base URL from environment
BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://trade-portal-demo.preview.emergentagent.com")
API_URL = f"{BASE_URL}/api"

# Test results tracking
test_results = []
total_tests = 0
passed_tests = 0
failed_tests = 0

# Global variables to store data between tests
seller_token = None
seller_user_id = None
buyer_token = None
uploaded_image_url = None
created_product_id = None
created_enquiry_id = None
featured_product_id = None


def log_test(test_name: str, passed: bool, details: str = ""):
    """Log test result"""
    global total_tests, passed_tests, failed_tests
    total_tests += 1
    if passed:
        passed_tests += 1
        status = "✅ PASS"
    else:
        failed_tests += 1
        status = "❌ FAIL"
    
    result = f"{status} | {test_name}"
    if details:
        result += f"\n    Details: {details}"
    
    test_results.append(result)
    print(result)


def random_email():
    """Generate random email for testing"""
    rand = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_seller_{rand}@psi-test.in"


def create_test_image():
    """Create a small test image and return as bytes"""
    img = Image.new('RGB', (100, 100), color='red')
    buf = BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return buf.getvalue()


# ============================================================================
# TEST 1: Health Check
# ============================================================================
def test_01_health_check():
    """GET /api/ - Health check"""
    try:
        response = requests.get(f"{API_URL}/", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("service") == "Product Search India" and data.get("status") == "ok":
            log_test("Test 1: Health Check", True, f"Response: {data}")
        else:
            log_test("Test 1: Health Check", False, f"Status: {response.status_code}, Data: {data}")
    except Exception as e:
        log_test("Test 1: Health Check", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 2: Seed Data
# ============================================================================
def test_02_seed_data():
    """POST /api/seed - Idempotent seed"""
    try:
        response = requests.post(f"{API_URL}/seed", timeout=15)
        data = response.json()
        
        if response.status_code == 200:
            # Should either seed or say already seeded
            if "Already seeded" in data.get("message", "") or (data.get("suppliers") == 3 and data.get("products") == 8):
                log_test("Test 2: Seed Data", True, f"Response: {data}")
            else:
                log_test("Test 2: Seed Data", False, f"Unexpected response: {data}")
        else:
            log_test("Test 2: Seed Data", False, f"Status: {response.status_code}, Data: {data}")
    except Exception as e:
        log_test("Test 2: Seed Data", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 3: Get Featured Products
# ============================================================================
def test_03_featured_products():
    """GET /api/products/featured - Returns up to 10 products"""
    global featured_product_id
    try:
        response = requests.get(f"{API_URL}/products/featured", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and isinstance(data, list):
            if len(data) > 0:
                # Check first product has required fields
                product = data[0]
                required_fields = ["id", "name", "price", "unit", "moq", "images", "city", "state", "verified", "seller_company"]
                missing_fields = [f for f in required_fields if f not in product]
                
                # Check for leaked fields
                leaked_fields = [f for f in ["_id", "password_hash"] if f in product]
                
                if not missing_fields and not leaked_fields:
                    featured_product_id = product["id"]
                    log_test("Test 3: Featured Products", True, f"Found {len(data)} products, first product has all required fields")
                else:
                    log_test("Test 3: Featured Products", False, f"Missing fields: {missing_fields}, Leaked fields: {leaked_fields}")
            else:
                log_test("Test 3: Featured Products", False, "No products returned")
        else:
            log_test("Test 3: Featured Products", False, f"Status: {response.status_code}, Data type: {type(data)}")
    except Exception as e:
        log_test("Test 3: Featured Products", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 4: Search Products by Query
# ============================================================================
def test_04_search_products():
    """GET /api/products?q=CNC - Search for CNC products"""
    try:
        response = requests.get(f"{API_URL}/products", params={"q": "CNC"}, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and isinstance(data, list):
            # Should include "Heavy Duty CNC Lathe Machine"
            cnc_products = [p for p in data if "CNC" in p.get("name", "").upper()]
            heavy_duty_cnc = [p for p in data if "Heavy Duty CNC Lathe Machine" in p.get("name", "")]
            
            if cnc_products and heavy_duty_cnc:
                log_test("Test 4: Search Products (q=CNC)", True, f"Found {len(cnc_products)} CNC products including 'Heavy Duty CNC Lathe Machine'")
            else:
                log_test("Test 4: Search Products (q=CNC)", False, f"Found {len(cnc_products)} CNC products, Heavy Duty CNC: {len(heavy_duty_cnc)}")
        else:
            log_test("Test 4: Search Products (q=CNC)", False, f"Status: {response.status_code}")
    except Exception as e:
        log_test("Test 4: Search Products (q=CNC)", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 5: Filter and Sort Products
# ============================================================================
def test_05_filter_sort_products():
    """GET /api/products?category=Industrial Machinery&verified=true&sort=price_low"""
    try:
        params = {
            "category": "Industrial Machinery",
            "verified": "true",
            "sort": "price_low"
        }
        response = requests.get(f"{API_URL}/products", params=params, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and isinstance(data, list):
            # Check all are Industrial Machinery and verified
            all_correct_category = all(p.get("category") == "Industrial Machinery" for p in data)
            all_verified = all(p.get("verified") == True for p in data)
            
            # Check sorting (price ascending)
            prices = [p.get("price", 0) for p in data]
            is_sorted = all(prices[i] <= prices[i+1] for i in range(len(prices)-1))
            
            if all_correct_category and all_verified and is_sorted:
                log_test("Test 5: Filter & Sort Products", True, f"Found {len(data)} products, all Industrial Machinery, verified, sorted by price")
            else:
                log_test("Test 5: Filter & Sort Products", False, f"Category OK: {all_correct_category}, Verified OK: {all_verified}, Sorted OK: {is_sorted}")
        else:
            log_test("Test 5: Filter & Sort Products", False, f"Status: {response.status_code}")
    except Exception as e:
        log_test("Test 5: Filter & Sort Products", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 6: Get Product by ID
# ============================================================================
def test_06_get_product_by_id():
    """GET /api/products/{id} - Get product details"""
    global featured_product_id
    try:
        if not featured_product_id:
            log_test("Test 6: Get Product by ID", False, "No product ID available from featured products")
            return
        
        response = requests.get(f"{API_URL}/products/{featured_product_id}", timeout=10)
        data = response.json()
        
        if response.status_code == 200:
            if "product" in data and "supplier" in data:
                product = data["product"]
                supplier = data["supplier"]
                
                # Check no leaked fields
                leaked_in_product = [f for f in ["_id", "password_hash"] if f in product]
                leaked_in_supplier = [f for f in ["_id", "password_hash"] if f in (supplier or {})]
                
                if not leaked_in_product and not leaked_in_supplier:
                    log_test("Test 6: Get Product by ID", True, f"Product and supplier returned, no leaked fields")
                else:
                    log_test("Test 6: Get Product by ID", False, f"Leaked fields in product: {leaked_in_product}, supplier: {leaked_in_supplier}")
            else:
                log_test("Test 6: Get Product by ID", False, f"Missing product or supplier in response: {data.keys()}")
        else:
            log_test("Test 6: Get Product by ID", False, f"Status: {response.status_code}")
        
        # Test 404 for unknown ID
        response_404 = requests.get(f"{API_URL}/products/unknown-id-12345", timeout=10)
        if response_404.status_code == 404:
            log_test("Test 6b: Get Product by ID (404)", True, "Returns 404 for unknown ID")
        else:
            log_test("Test 6b: Get Product by ID (404)", False, f"Expected 404, got {response_404.status_code}")
            
    except Exception as e:
        log_test("Test 6: Get Product by ID", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 7: Register New Seller
# ============================================================================
def test_07_register_seller():
    """POST /api/auth/register - Register new seller"""
    global buyer_token
    try:
        email = random_email()
        payload = {
            "email": email,
            "password": "pass1234",
            "name": "Test Seller",
            "role": "seller",
            "company": "Test Co"
        }
        response = requests.post(f"{API_URL}/auth/register", json=payload, timeout=10)
        data = response.json()
        
        if response.status_code == 200:
            if "token" in data and "user" in data:
                user = data["user"]
                if user.get("role") == "seller" and user.get("email") == email:
                    buyer_token = data["token"]  # Store for later use
                    log_test("Test 7: Register Seller", True, f"Seller registered successfully with email {email}")
                else:
                    log_test("Test 7: Register Seller", False, f"User role or email mismatch: {user}")
            else:
                log_test("Test 7: Register Seller", False, f"Missing token or user in response")
        else:
            log_test("Test 7: Register Seller", False, f"Status: {response.status_code}, Data: {data}")
        
        # Test duplicate email
        response_dup = requests.post(f"{API_URL}/auth/register", json=payload, timeout=10)
        if response_dup.status_code == 400:
            log_test("Test 7b: Register Duplicate Email", True, "Returns 400 for duplicate email")
        else:
            log_test("Test 7b: Register Duplicate Email", False, f"Expected 400, got {response_dup.status_code}")
            
    except Exception as e:
        log_test("Test 7: Register Seller", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 8: Login with Seeded Account
# ============================================================================
def test_08_login():
    """POST /api/auth/login - Login with seeded account"""
    global seller_token, seller_user_id
    try:
        payload = {
            "email": "shakti@psi-demo.in",
            "password": "demo1234"
        }
        response = requests.post(f"{API_URL}/auth/login", json=payload, timeout=10)
        data = response.json()
        
        if response.status_code == 200:
            if "token" in data and "user" in data:
                user = data["user"]
                if user.get("role") == "seller" and user.get("name") == "Rakesh Patel":
                    seller_token = data["token"]
                    seller_user_id = user.get("id")
                    log_test("Test 8: Login", True, f"Login successful for Rakesh Patel (seller)")
                else:
                    log_test("Test 8: Login", False, f"User role or name mismatch: {user}")
            else:
                log_test("Test 8: Login", False, f"Missing token or user in response")
        else:
            log_test("Test 8: Login", False, f"Status: {response.status_code}, Data: {data}")
        
        # Test wrong password
        wrong_payload = {
            "email": "shakti@psi-demo.in",
            "password": "wrongpassword"
        }
        response_wrong = requests.post(f"{API_URL}/auth/login", json=wrong_payload, timeout=10)
        if response_wrong.status_code == 401:
            log_test("Test 8b: Login Wrong Password", True, "Returns 401 for wrong password")
        else:
            log_test("Test 8b: Login Wrong Password", False, f"Expected 401, got {response_wrong.status_code}")
            
    except Exception as e:
        log_test("Test 8: Login", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 9: Get Current User
# ============================================================================
def test_09_get_me():
    """GET /api/auth/me - Get current user with token"""
    global seller_token
    try:
        if not seller_token:
            log_test("Test 9: Get Me", False, "No seller token available")
            return
        
        headers = {"Authorization": f"Bearer {seller_token}"}
        response = requests.get(f"{API_URL}/auth/me", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200:
            if "user" in data:
                user = data["user"]
                # Check no leaked fields
                leaked = [f for f in ["_id", "password_hash"] if f in user]
                if not leaked:
                    log_test("Test 9: Get Me", True, f"User returned: {user.get('name')}, no leaked fields")
                else:
                    log_test("Test 9: Get Me", False, f"Leaked fields: {leaked}")
            else:
                log_test("Test 9: Get Me", False, f"Missing user in response")
        else:
            log_test("Test 9: Get Me", False, f"Status: {response.status_code}")
        
        # Test without token
        response_no_token = requests.get(f"{API_URL}/auth/me", timeout=10)
        if response_no_token.status_code == 401:
            log_test("Test 9b: Get Me Without Token", True, "Returns 401 without token")
        else:
            log_test("Test 9b: Get Me Without Token", False, f"Expected 401, got {response_no_token.status_code}")
            
    except Exception as e:
        log_test("Test 9: Get Me", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 10: Upload Image
# ============================================================================
def test_10_upload_image():
    """POST /api/uploads - Upload image"""
    global uploaded_image_url
    try:
        # Create test image
        img_bytes = create_test_image()
        files = {"file": ("test.png", img_bytes, "image/png")}
        
        response = requests.post(f"{API_URL}/uploads", files=files, timeout=15)
        data = response.json()
        
        if response.status_code == 200:
            if "url" in data and data["url"].startswith("data:image/"):
                uploaded_image_url = data["url"]
                log_test("Test 10: Upload Image", True, f"Image uploaded, size: {data.get('size')} bytes")
            else:
                log_test("Test 10: Upload Image", False, f"Invalid URL format: {data.get('url', '')[:50]}")
        else:
            log_test("Test 10: Upload Image", False, f"Status: {response.status_code}, Data: {data}")
        
        # Test non-image file
        files_txt = {"file": ("test.txt", b"Hello World", "text/plain")}
        response_txt = requests.post(f"{API_URL}/uploads", files=files_txt, timeout=10)
        if response_txt.status_code == 400:
            log_test("Test 10b: Upload Non-Image", True, "Returns 400 for non-image file")
        else:
            log_test("Test 10b: Upload Non-Image", False, f"Expected 400, got {response_txt.status_code}")
            
    except Exception as e:
        log_test("Test 10: Upload Image", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 11: Create Product
# ============================================================================
def test_11_create_product():
    """POST /api/products - Create product as seller"""
    global seller_token, uploaded_image_url, created_product_id, seller_user_id
    try:
        if not seller_token:
            log_test("Test 11: Create Product", False, "No seller token available")
            return
        
        if not uploaded_image_url:
            # Use a placeholder if upload failed
            uploaded_image_url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        
        payload = {
            "name": "Test Product CNC Machine",
            "category": "Industrial Machinery",
            "subcategory": "CNC Machines",
            "price": 50000,
            "unit": "Piece",
            "moq": "1 Piece",
            "images": [uploaded_image_url],
            "city": "Mumbai",
            "state": "Maharashtra",
            "description": "Test product for API testing"
        }
        
        headers = {"Authorization": f"Bearer {seller_token}"}
        response = requests.post(f"{API_URL}/products", json=payload, headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200:
            if "id" in data and data.get("seller_id") == seller_user_id:
                created_product_id = data["id"]
                log_test("Test 11: Create Product", True, f"Product created with ID: {created_product_id}")
            else:
                log_test("Test 11: Create Product", False, f"Missing ID or seller_id mismatch: {data}")
        else:
            log_test("Test 11: Create Product", False, f"Status: {response.status_code}, Data: {data}")
        
        # Test without token
        response_no_token = requests.post(f"{API_URL}/products", json=payload, timeout=10)
        if response_no_token.status_code == 401:
            log_test("Test 11b: Create Product Without Token", True, "Returns 401 without token")
        else:
            log_test("Test 11b: Create Product Without Token", False, f"Expected 401, got {response_no_token.status_code}")
        
        # Test with buyer token (should fail with 403)
        if buyer_token:
            headers_buyer = {"Authorization": f"Bearer {buyer_token}"}
            response_buyer = requests.post(f"{API_URL}/products", json=payload, headers=headers_buyer, timeout=10)
            if response_buyer.status_code == 403:
                log_test("Test 11c: Create Product as Buyer", True, "Returns 403 for buyer token")
            else:
                log_test("Test 11c: Create Product as Buyer", False, f"Expected 403, got {response_buyer.status_code}")
        
    except Exception as e:
        log_test("Test 11: Create Product", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 12: Get My Products
# ============================================================================
def test_12_get_my_products():
    """GET /api/products/mine - Get seller's products"""
    global seller_token, created_product_id
    try:
        if not seller_token:
            log_test("Test 12: Get My Products", False, "No seller token available")
            return
        
        headers = {"Authorization": f"Bearer {seller_token}"}
        response = requests.get(f"{API_URL}/products/mine", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and isinstance(data, list):
            # Check if created product is in the list
            if created_product_id:
                product_ids = [p.get("id") for p in data]
                if created_product_id in product_ids:
                    log_test("Test 12: Get My Products", True, f"Found {len(data)} products including newly created one")
                else:
                    log_test("Test 12: Get My Products", False, f"Created product not found in list of {len(data)} products")
            else:
                log_test("Test 12: Get My Products", True, f"Found {len(data)} products")
        else:
            log_test("Test 12: Get My Products", False, f"Status: {response.status_code}")
            
    except Exception as e:
        log_test("Test 12: Get My Products", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 13: Delete Product
# ============================================================================
def test_13_delete_product():
    """DELETE /api/products/{id} - Delete product"""
    global seller_token, created_product_id, buyer_token
    try:
        if not seller_token or not created_product_id:
            log_test("Test 13: Delete Product", False, "No seller token or product ID available")
            return
        
        # First try with different seller (should fail with 403)
        if buyer_token:
            headers_buyer = {"Authorization": f"Bearer {buyer_token}"}
            response_other = requests.delete(f"{API_URL}/products/{created_product_id}", headers=headers_buyer, timeout=10)
            if response_other.status_code == 403:
                log_test("Test 13a: Delete Product as Different Seller", True, "Returns 403 for different seller")
            else:
                log_test("Test 13a: Delete Product as Different Seller", False, f"Expected 403, got {response_other.status_code}")
        
        # Now delete as owner
        headers = {"Authorization": f"Bearer {seller_token}"}
        response = requests.delete(f"{API_URL}/products/{created_product_id}", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("ok") == True:
            log_test("Test 13: Delete Product", True, "Product deleted successfully")
        else:
            log_test("Test 13: Delete Product", False, f"Status: {response.status_code}, Data: {data}")
            
    except Exception as e:
        log_test("Test 13: Delete Product", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 14: Create Enquiry
# ============================================================================
def test_14_create_enquiry():
    """POST /api/enquiries - Create enquiry (public endpoint)"""
    global featured_product_id, created_enquiry_id
    try:
        if not featured_product_id:
            log_test("Test 14: Create Enquiry", False, "No product ID available")
            return
        
        payload = {
            "product_id": featured_product_id,
            "buyer_name": "Test Buyer",
            "buyer_email": "testbuyer@example.com",
            "buyer_phone": "+91 9876543210",
            "qty": "10 Pieces",
            "message": "Interested in bulk purchase"
        }
        
        response = requests.post(f"{API_URL}/enquiries", json=payload, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get("ok") == True:
            created_enquiry_id = data.get("id")
            log_test("Test 14: Create Enquiry", True, f"Enquiry created with ID: {created_enquiry_id}")
        else:
            log_test("Test 14: Create Enquiry", False, f"Status: {response.status_code}, Data: {data}")
        
        # Test with invalid product_id
        invalid_payload = {**payload, "product_id": "invalid-product-id-12345"}
        response_invalid = requests.post(f"{API_URL}/enquiries", json=invalid_payload, timeout=10)
        if response_invalid.status_code == 404:
            log_test("Test 14b: Create Enquiry Invalid Product", True, "Returns 404 for invalid product_id")
        else:
            log_test("Test 14b: Create Enquiry Invalid Product", False, f"Expected 404, got {response_invalid.status_code}")
            
    except Exception as e:
        log_test("Test 14: Create Enquiry", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 15: Get My Enquiries
# ============================================================================
def test_15_get_my_enquiries():
    """GET /api/enquiries/mine - Get seller's enquiries"""
    global seller_token, created_enquiry_id
    try:
        if not seller_token:
            log_test("Test 15: Get My Enquiries", False, "No seller token available")
            return
        
        headers = {"Authorization": f"Bearer {seller_token}"}
        response = requests.get(f"{API_URL}/enquiries/mine", headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and isinstance(data, list):
            # The enquiry we created should appear for the correct seller
            # Note: The enquiry was for a product from shakti@psi-demo.in (our logged-in seller)
            log_test("Test 15: Get My Enquiries", True, f"Found {len(data)} enquiries for seller")
        else:
            log_test("Test 15: Get My Enquiries", False, f"Status: {response.status_code}")
            
    except Exception as e:
        log_test("Test 15: Get My Enquiries", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 16: Get Supplier Details
# ============================================================================
def test_16_get_supplier():
    """GET /api/suppliers/{user_id} - Get supplier details"""
    global seller_user_id
    try:
        if not seller_user_id:
            log_test("Test 16: Get Supplier", False, "No seller user_id available")
            return
        
        response = requests.get(f"{API_URL}/suppliers/{seller_user_id}", timeout=10)
        data = response.json()
        
        if response.status_code == 200:
            if "supplier" in data and "user" in data and "products" in data and "stats" in data:
                supplier = data["supplier"]
                user = data["user"]
                products = data["products"]
                stats = data["stats"]
                
                # Check structure
                if "product_count" in stats and "categories" in stats:
                    # Check no leaked fields
                    leaked_supplier = [f for f in ["_id", "password_hash"] if f in supplier]
                    leaked_user = [f for f in ["_id", "password_hash"] if f in user]
                    
                    if not leaked_supplier and not leaked_user:
                        log_test("Test 16: Get Supplier", True, f"Supplier details returned with {stats['product_count']} products, {len(stats['categories'])} categories")
                    else:
                        log_test("Test 16: Get Supplier", False, f"Leaked fields in supplier: {leaked_supplier}, user: {leaked_user}")
                else:
                    log_test("Test 16: Get Supplier", False, f"Missing stats fields: {stats}")
            else:
                log_test("Test 16: Get Supplier", False, f"Missing required fields in response: {data.keys()}")
        else:
            log_test("Test 16: Get Supplier", False, f"Status: {response.status_code}")
            
    except Exception as e:
        log_test("Test 16: Get Supplier", False, f"Exception: {str(e)}")


# ============================================================================
# MAIN TEST RUNNER
# ============================================================================
def main():
    print("=" * 80)
    print("Product Search India B2B Portal - Backend API Test Suite")
    print(f"Testing against: {API_URL}")
    print("=" * 80)
    print()
    
    # Run all tests in sequence
    test_01_health_check()
    test_02_seed_data()
    test_03_featured_products()
    test_04_search_products()
    test_05_filter_sort_products()
    test_06_get_product_by_id()
    test_07_register_seller()
    test_08_login()
    test_09_get_me()
    test_10_upload_image()
    test_11_create_product()
    test_12_get_my_products()
    test_13_delete_product()
    test_14_create_enquiry()
    test_15_get_my_enquiries()
    test_16_get_supplier()
    
    # Print summary
    print()
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests} ✅")
    print(f"Failed: {failed_tests} ❌")
    print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")
    print("=" * 80)
    
    # Exit with appropriate code
    sys.exit(0 if failed_tests == 0 else 1)


if __name__ == "__main__":
    main()
