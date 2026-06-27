# ShipIntel API Specification

## 1. Overview and Standards

This document defines the REST APIs for the ShipIntel logistics intelligence platform backend (Spring Boot).

### 1.1 API Standards
* **Base URL:** `/api/v1`
* **Content Type:** `application/json` for both Requests and Responses (JSON only)
* **Naming Conventions:** RESTful standard (lowercase, plural nouns, hyphen-separated for multi-word resources, e.g., `/api/v1/carrier-recommendations`)
* **Design Philosophy:** Endpoints are strictly designed around resources. Controllers must not contain business logic.

### 1.2 Standard Response Format
All API responses, whether successful or erroneous, will adhere to the following wrapper structure to ensure consistency for the frontend.

**Success Response Example:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "name": "FedEx"
  },
  "timestamp": "2026-06-27T17:34:00Z"
}
```

**Error Response Example:**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  },
  "timestamp": "2026-06-27T17:34:00Z"
}
```

---

## 2. Non-Functional Requirements

### 2.1 Authentication Strategy (Future)
* **Mechanism:** JSON Web Tokens (JWT).
* **Header:** `Authorization: Bearer <token>`
* **Flow:** Currently APIs might be open or mock-auth, but the architecture will support a `SecurityFilterChain` that validates JWTs, extracting roles/permissions for endpoints marked as requiring authentication.

### 2.2 API Versioning Strategy
* **Strategy:** URI Path Versioning (e.g., `/api/v1/...`).
* **Rationale:** Easiest to route at load balancers and simplest for frontend clients to configure.

### 2.3 Rate Limiting Recommendations
* **Mechanism:** Token Bucket algorithm per client IP or authenticated user ID.
* **Limits:** e.g., 100 requests per minute for public endpoints; 1000 requests per minute for authenticated endpoints.
* **Headers:** Include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` in responses.

### 2.4 Logging Recommendations
* **Scope:** Log all incoming requests and outgoing responses at the `DEBUG` level (excluding sensitive payload data like passwords).
* **Correlation:** Use an `X-Correlation-ID` header (or generate a UUID per request) to trace the request through all layers (MDC - Mapped Diagnostic Context).
* **Error Logging:** Log full stack traces for 500s at `ERROR` level.

### 2.5 Error Handling Strategy
* **Implementation:** Use `@RestControllerAdvice` in Spring Boot to catch exceptions globally.
* **Mapping:** Map custom business exceptions to appropriate HTTP status codes (e.g., `ResourceNotFoundException` -> 404).

### 2.6 Pagination Strategy
* **Style:** Offset-based pagination using `page` (0-indexed) and `size`.
* **Standard Response Data for Paginated APIs:**
```json
"data": {
  "content": [...],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "totalElements": 150,
    "totalPages": 8,
    "last": false
  }
}
```

### 2.7 HTTP Status Code Guidelines
* **200 OK:** Successful GET, PUT, or POST (when returning data).
* **201 Created:** Successful POST that creates a new resource.
* **204 No Content:** Successful DELETE or PUT with no body returned.
* **400 Bad Request:** Validation errors or malformed syntax.
* **401 Unauthorized:** Missing or invalid authentication token.
* **403 Forbidden:** Valid token, but insufficient permissions.
* **404 Not Found:** Resource does not exist.
* **409 Conflict:** Resource state conflict (e.g., duplicate email).
* **429 Too Many Requests:** Rate limit exceeded.
* **500 Internal Server Error:** Unhandled backend exception.

---

## 3. Module API Specifications

### 3.1 Couriers Module

#### 3.1.1 Get all couriers (with Search & Filtering)
* **Endpoint:** `/api/v1/couriers`
* **HTTP Method:** `GET`
* **Description:** Retrieves a paginated list of couriers. Supports searching by name and filtering by coverage or transport mode.
* **Authentication Required:** No
* **Path Variables:** None
* **Query Parameters:**
  * `page` (Integer, default: 0): Page number
  * `size` (Integer, default: 20): Page size
  * `sort` (String, default: "name,asc"): Sort field and direction
  * `q` (String, optional): Search term for courier name or description
  * `coverage` (String, optional): Filter by coverage area (e.g., "Global", "North America")
  * `transportMode` (String, optional): Filter by mode (e.g., "Air", "Sea", "Road")
* **Request Body:** None
* **Validation Rules:** `page` >= 0, `size` > 0 and <= 100
* **Success Response:** 200 OK (Returns standard format with paginated data)
* **Error Responses:** 400 Bad Request (Invalid parameters)

#### 3.1.2 Get courier by ID
* **Endpoint:** `/api/v1/couriers/{id}`
* **HTTP Method:** `GET`
* **Description:** Retrieves detailed information for a specific courier.
* **Authentication Required:** No
* **Path Variables:** `id` (Long, required): Courier ID
* **Query Parameters:** None
* **Request Body:** None
* **Validation Rules:** `id` must be a positive integer.
* **Success Response:** 200 OK (Returns standard format with single courier object)
* **Error Responses:** 400 Bad Request (Invalid ID format), 404 Not Found (Courier not found)

#### 3.1.3 Get courier statistics
* **Endpoint:** `/api/v1/couriers/statistics`
* **HTTP Method:** `GET`
* **Description:** Retrieves aggregated statistics for couriers (e.g., total active, by mode).
* **Authentication Required:** Yes (Admin only)
* **Path Variables:** None
* **Query Parameters:** None
* **Request Body:** None
* **Validation Rules:** None
* **Success Response:** 200 OK (Returns standard format with stats object)
* **Error Responses:** 401 Unauthorized, 403 Forbidden

---

### 3.2 Calculator Module

#### 3.2.1 Calculate volumetric weight
* **Endpoint:** `/api/v1/calculator/volumetric-weight`
* **HTTP Method:** `POST`
* **Description:** Calculates the volumetric (dimensional) weight based on dimensions and an optional divisor.
* **Authentication Required:** No
* **Path Variables:** None
* **Query Parameters:** None
* **Request Body:**
```json
{
  "length": 50.0,
  "width": 40.0,
  "height": 30.0,
  "unit": "cm",
  "divisor": 5000
}
```
* **Validation Rules:** Dimensions must be > 0. `unit` must be "cm" or "in". `divisor` must be > 0.
* **Success Response:** 200 OK (Returns calculated weight)
* **Error Responses:** 400 Bad Request (Validation failure)

#### 3.2.2 Calculate freight estimate
* **Endpoint:** `/api/v1/calculator/freight-estimate`
* **HTTP Method:** `POST`
* **Description:** Calculates an estimated freight cost based on origin, destination, weight, and mode.
* **Authentication Required:** Yes
* **Path Variables:** None
* **Query Parameters:** None
* **Request Body:**
```json
{
  "originZip": "10001",
  "destinationZip": "90001",
  "weightKg": 15.5,
  "transportMode": "Air"
}
```
* **Validation Rules:** All fields required. `weightKg` > 0. `transportMode` must be valid enum.
* **Success Response:** 200 OK (Returns estimate details including currency and cost)
* **Error Responses:** 400 Bad Request (Validation failure), 401 Unauthorized, 422 Unprocessable Entity (Route not supported)

#### 3.2.3 Get carrier recommendations
* **Endpoint:** `/api/v1/calculator/carrier-recommendations`
* **HTTP Method:** `POST`
* **Description:** Returns a list of recommended carriers sorted by best match based on shipment criteria.
* **Authentication Required:** Yes
* **Path Variables:** None
* **Query Parameters:** None
* **Request Body:** Same payload as freight estimate.
* **Validation Rules:** All fields required.
* **Success Response:** 200 OK (Returns array of carrier objects with estimated time and cost)
* **Error Responses:** 400 Bad Request, 401 Unauthorized

---

### 3.3 Resources Module

#### 3.3.1 Get all articles (with Search & Filtering)
* **Endpoint:** `/api/v1/articles`
* **HTTP Method:** `GET`
* **Description:** Retrieves a paginated list of resources/articles. Supports searching and category filtering.
* **Authentication Required:** No
* **Path Variables:** None
* **Query Parameters:**
  * `page` (Integer, default: 0)
  * `size` (Integer, default: 20)
  * `q` (String, optional): Search query for title/content
  * `category` (String, optional): Filter by article category
* **Request Body:** None
* **Validation Rules:** `page` >= 0, `size` > 0
* **Success Response:** 200 OK (Returns paginated articles)
* **Error Responses:** 400 Bad Request

#### 3.3.2 Get article details
* **Endpoint:** `/api/v1/articles/{id}`
* **HTTP Method:** `GET`
* **Description:** Retrieves the full content of a specific article.
* **Authentication Required:** No
* **Path Variables:** `id` (Long, required): Article ID
* **Query Parameters:** None
* **Request Body:** None
* **Validation Rules:** `id` > 0
* **Success Response:** 200 OK (Returns single article object)
* **Error Responses:** 404 Not Found

---

### 3.4 Newsletter Module

#### 3.4.1 Subscribe
* **Endpoint:** `/api/v1/newsletter/subscribe`
* **HTTP Method:** `POST`
* **Description:** Subscribes an email address to the newsletter.
* **Authentication Required:** No
* **Path Variables:** None
* **Query Parameters:** None
* **Request Body:**
```json
{
  "email": "user@example.com",
  "name": "Jane Doe"
}
```
* **Validation Rules:** `email` must be a valid format and required.
* **Success Response:** 201 Created (Message: "Successfully subscribed")
* **Error Responses:** 400 Bad Request (Invalid email), 409 Conflict (Already subscribed)

#### 3.4.2 Unsubscribe
* **Endpoint:** `/api/v1/newsletter/unsubscribe`
* **HTTP Method:** `POST`
* **Description:** Unsubscribes an email address from the newsletter.
* **Authentication Required:** No
* **Path Variables:** None
* **Query Parameters:** None
* **Request Body:**
```json
{
  "email": "user@example.com"
}
```
* **Validation Rules:** `email` must be a valid format and required.
* **Success Response:** 200 OK (Message: "Successfully unsubscribed")
* **Error Responses:** 400 Bad Request, 404 Not Found (Email not in list)

---

### 3.5 Contact Module

#### 3.5.1 Submit contact/support request
* **Endpoint:** `/api/v1/contact`
* **HTTP Method:** `POST`
* **Description:** Submits a new contact form or support request.
* **Authentication Required:** No
* **Path Variables:** None
* **Query Parameters:** None
* **Request Body:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "subject": "Integration Issue",
  "message": "We are having trouble integrating the API...",
  "type": "SUPPORT" 
}
```
* **Validation Rules:** `name`, `email`, `subject`, `message` are required strings. `type` must be an enum (e.g., SUPPORT, SALES, GENERAL).
* **Success Response:** 201 Created (Message: "Request submitted successfully")
* **Error Responses:** 400 Bad Request (Validation failures)
