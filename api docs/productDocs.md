# Product API

API endpoints for managing products in the marketplace.

## Endpoints

### Create Product
Creates a new product with images uploaded to Cloudinary.

`POST /products/create`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | String | Yes | Title of the product |
| description | String | Yes | Detailed description of the product |
| price | Number | Yes | Price of the product |
| category | ObjectId | Yes | Category ID the product belongs to |
| isAvailable | Boolean | No | Product availability status (defaults to true) |
| images | File(s) | Yes | Product images (at least one required) |

#### Response

**Success (201)**
```json
{
  "success": true,
  "product": {
    "_id": "productId",
    "title": "Product Title",
    "description": "Product Description",
    "price": 1000,
    "category": "categoryId",
    "artist": "artistId",
    "isAvailable": true,
    "images": [
      {
        "secure_url": "https://cloudinary.com/image-url",
        "public_id": "image-public-id"
      }
    ]
  }
}
```

**Error (400, 500)**
```json
{
  "success": false,
  "message": "Error message"
}
```

### Delete Product
Deletes a product and its associated images from Cloudinary.

`DELETE /products/delete/:id`

#### Path Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| id | Yes | ID of the product to delete |

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Error (401, 404, 500)**
```json
{
  "success": false,
  "message": "Error message"
}
```

### Update Product
Updates an existing product.

`PUT /products/update/:id`

#### Path Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| id | Yes | ID of the product to update |

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | String | No | New title for the product |
| description | String | No | New description for the product |
| price | Number | No | Updated price of the product |
| category | ObjectId | No | New category ID for the product |
| isAvailable | Boolean | No | Updated availability status |
| images | File(s) | No | New product images (replaces existing ones) |

#### Response

**Success (200)**
```json
{
  "success": true,
  "product": {
    "_id": "productId",
    "title": "Updated Product Title",
    "description": "Updated Product Description",
    "price": 1500,
    "category": "categoryId",
    "artist": "artistId",
    "isAvailable": true,
    "images": [
      {
        "secure_url": "https://cloudinary.com/new-image-url",
        "public_id": "new-image-public-id"
      }
    ]
  }
}
```

**Error (401, 404, 500)**
```json
{
  "success": false,
  "message": "Error message"
}
```

### Get All Products
Retrieves all products with populated category and artist details.

`GET /products/get`

#### Response

**Success (200)**
```json
{
  "success": true,
  "products": [
    {
      "_id": "productId",
      "title": "Product Title",
      "description": "Product Description",
      "price": 1000,
      "category": {
        "_id": "categoryId",
        "name": "Category Name",
        "description": "Category Description"
      },
      "artist": {
        "_id": "artistId",
        "username": "Artist Name",
        "bio": "Artist Bio"
      },
      "isAvailable": true,
      "images": [
        {
          "secure_url": "https://cloudinary.com/image-url",
          "public_id": "image-public-id"
        }
      ]
    },
    // other products...
  ]
}
```

**Error (500)**
```json
{
  "success": false,
  "message": "Error message"
}
```

### Get Product by ID
Retrieves a specific product by its ID with populated category and artist details.

`GET /products/get/:id`

#### Path Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| id | Yes | ID of the product to retrieve |

#### Response

**Success (200)**
```json
{
  "success": true,
  "product": {
    "_id": "productId",
    "title": "Product Title",
    "description": "Product Description",
    "price": 1000,
    "category": {
      "_id": "categoryId",
      "name": "Category Name",
      "description": "Category Description"
    },
    "artist": {
      "_id": "artistId",
      "username": "Artist Name",
      "bio": "Artist Bio"
    },
    "isAvailable": true,
    "images": [
      {
        "secure_url": "https://cloudinary.com/image-url",
        "public_id": "image-public-id"
      }
    ]
  }
}
```

**Error (404, 500)**
```json
{
  "success": false,
  "message": "Error message"
}
```

## Authentication

The Create, Update, and Delete endpoints require authentication as an artist. A product can only be modified or deleted by the artist who created it.

## Notes

There are two potential bugs in the code:

1. In the `deleteProduct` and `updateProduct` functions, `req.user.id` is used incorrectly. It should be just `req.user.id` instead of `req.user.id.id`.

2. In the `updateProduct` function, when handling files, it needs to check if files is an array similar to the createProduct function, otherwise it might cause errors with a single file.
