# Product Category API

API endpoints for managing product categories.

## Endpoints

### Create Category
Creates a new product category.

`POST /categories/create`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | String | Yes | Unique name of the category |
| description | String | Yes | Detailed description of the category |
| isFeatured | Boolean | No | Whether the category should be featured |

#### Response

**Success (201)**
```json
{
  "success": true,
  "message": "Category created successfully",
  "category": {
    "_id": "categoryId",
    "name": "Category Name",
    "description": "Category Description",
    "isFeatured": true
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

### Get All Categories
Retrieves all product categories.

`GET /categories/get`

#### Response

**Success (200)**
```json
{
  "success": true,
  "categories": [
    {
      "_id": "categoryId",
      "name": "Category Name",
      "description": "Category Description",
      "isFeatured": true
    },
    // other categories...
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

### Get Category by ID
Retrieves a specific category by its ID.

`GET /categories/get/:id`

#### Path Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| id | Yes | ID of the category to retrieve |

#### Response

**Success (200)**
```json
{
  "success": true,
  "category": {
    "_id": "categoryId",
    "name": "Category Name",
    "description": "Category Description",
    "isFeatured": true
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

### Update Category
Updates an existing category.

`PUT /categories/update/:id`

#### Path Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| id | Yes | ID of the category to update |

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | String | No | New name for the category |
| description | String | No | New description for the category |
| isFeatured | Boolean | No | Updated featured status |

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "category": {
    "_id": "categoryId",
    "name": "Updated Category Name",
    "description": "Updated Category Description",
    "isFeatured": true
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

### Delete Category
Deletes a category if it has no associated products.

`DELETE /categories/delete/:id`

#### Path Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| id | Yes | ID of the category to delete |

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Error (400, 404, 500)**
```json
{
  "success": false,
  "message": "Error message"
}
```

## Notes

1. Categories with associated products cannot be deleted.
2. There is a bug in the `deleteCategory` function: `Product.findOne()` returns a single document, not an array, so checking `product.length` will cause an error. The code should be updated to either use `Product.find()` which returns an array, or check if the product exists rather than its length.
