# Cart API

API endpoints for managing user shopping cart functionality.

## Endpoints

### Add Product to Cart
Adds a product to the customer's cart.

`POST /cart/add`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| productId | String | Yes | ID of the product to add to cart |

#### Response

**Success (200)**
```json
{
  "message": "Product added to cart successfully"
}
```

**Error (400, 500)**
```json
{
  "message": "Error message",
  "error": "Error details" 
}
```

### Remove Product from Cart
Removes one quantity of a product from the cart (or the entire product if quantity becomes zero).

`POST /cart/remove`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| productId | String | Yes | ID of the product to remove from cart |

#### Response

**Success (200)**
```json
{
  "message": "Product removed from cart successfully"
}
```

**Error (400, 401, 404, 500)**
```json
{
  "message": "Error message",
  "error": "Error details"
}
```

### Get Cart
Retrieves the current user's cart with all products.

`GET /cart/get`

#### Response

**Success (200)**
```json
{
  "cart": {
    "customer": "customerId",
    "products": [
      {
        "product": {
          "_id": "productId",
          "name": "Product Name",
          "price": 1000,
          "description": "Product description",
          // other product fields...
        },
        "quantity": 2
      },
      // other products...
    ]
  }
}
```

**Error (401, 404, 500)**
```json
{
  "message": "Error message",
  "error": "Error details"
}
```

### Empty Cart
Removes all products from the user's cart.

`POST /cart/empty`

#### Response

**Success (200)**
```json
{
  "message": "Cart emptied successfully"
}
```

**Error (400, 401, 404, 500)**
```json
{
  "message": "Error message",
  "error": "Error details"
}
```

## Authentication

All cart endpoints require a valid JWT token for authentication. The user ID is extracted from the token and used to identify the customer's cart.

## Note

There is a potential issue in the `emptyCart` function where it checks `cart.customer.toString() !== customerId` before checking if the cart exists. This could lead to an error if the cart is not found, as it would try to access properties of a null object. The correct order would be to first check if the cart exists and then validate ownership.