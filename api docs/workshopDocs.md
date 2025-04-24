# Workshop API

API endpoints for managing artist workshops.

## Endpoints

### Create Workshop
Creates a new workshop with thumbnail image uploaded to Cloudinary.

`POST /workshops/create`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | String | Yes | Title of the workshop |
| description | String | Yes | Detailed description of the workshop |
| date | Date | Yes | Date when the workshop will be held |
| type | String | Yes | Type/category of the workshop |
| price | Number | Yes | Price of the workshop |
| address | String | Yes | Street address where workshop will be held |
| city | String | Yes | City where workshop will be held |
| state | String | Yes | State where workshop will be held |
| pincode | String | Yes | Postal/ZIP code of the workshop location |
| country | String | Yes | Country where workshop will be held |
| lat | Number | Yes | Latitude coordinate of the workshop location |
| lng | Number | Yes | Longitude coordinate of the workshop location |
| thumbnail | File | Yes | Thumbnail image for the workshop |

#### Response

**Success (201)**
```json
{
  "success": true,
  "message": "Workshop created successfully",
  "workshop": {
    "_id": "workshopId",
    "title": "Workshop Title",
    "description": "Workshop Description",
    "date": "2025-05-15T10:00:00.000Z",
    "type": "Painting",
    "artist": "artistId",
    "image": {
      "secure_url": "https://cloudinary.com/image-url",
      "public_id": "image-public-id"
    },
    "price": 2000,
    "location": {
      "address": "123 Art Street",
      "city": "Artistic City",
      "state": "Creative State",
      "pincode": "123456",
      "country": "Artland",
      "coordinates": {
        "lat": 12.345678,
        "lng": 98.765432
      }
    },
    "participents": []
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

### Update Workshop
Updates an existing workshop.

`PUT /workshops/update/:id`

#### Path Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| id | Yes | ID of the workshop to update |

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | String | No | New title for the workshop |
| description | String | No | New description for the workshop |
| date | Date | No | Updated date for the workshop |
| type | String | No | Updated type/category of the workshop |
| price | Number | No | Updated price of the workshop |
| address | String | No | Updated street address |
| city | String | No | Updated city |
| state | String | No | Updated state |
| pincode | String | No | Updated postal/ZIP code |
| country | String | No | Updated country |
| lat | Number | No | Updated latitude coordinate |
| lng | Number | No | Updated longitude coordinate |
| thumbnail | File | No | New thumbnail image (replaces existing one) |

#### Response

**Success (201)**
```json
{
  "success": true,
  "message": "Workshop updated successfully",
  "workShop": {
    "_id": "workshopId",
    "title": "Updated Workshop Title",
    "description": "Updated Workshop Description",
    "date": "2025-06-15T10:00:00.000Z",
    "type": "Updated Type",
    "artist": "artistId",
    "image": {
      "secure_url": "https://cloudinary.com/updated-image-url",
      "public_id": "updated-image-public-id"
    },
    "price": 2500,
    "location": {
      "address": "456 New Art Street",
      "city": "New City",
      "state": "New State",
      "pincode": "654321",
      "country": "New Country",
      "coordinates": {
        "lat": 23.456789,
        "lng": 87.654321
      }
    },
    "participents": []
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

### Delete Workshop
Deletes a workshop if it has no participants.

`DELETE /workshops/delete/:id`

#### Path Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| id | Yes | ID of the workshop to delete |

#### Response

**Success (201)**
```json
{
  "success": true,
  "message": "Workshop deleted successfully"
}
```

**Error (400, 401, 404, 500)**
```json
{
  "success": false,
  "message": "Error message"
}
```

### Get All Workshops
Retrieves all workshops with artist details.

`GET /workshops/get`

#### Response

**Success (201)**
```json
{
  "success": true,
  "message": "Workshops fetched successfully",
  "workShops": [
    {
      "_id": "workshopId",
      "title": "Workshop Title",
      "description": "Workshop Description",
      "date": "2025-05-15T10:00:00.000Z",
      "type": "Painting",
      "artist": {
        "_id": "artistId",
        "username": "Artist Name",
        "bio": "Artist Bio"
      },
      "image": {
        "secure_url": "https://cloudinary.com/image-url",
        "public_id": "image-public-id"
      },
      "price": 2000,
      "location": {
        "address": "123 Art Street",
        "city": "Artistic City",
        "state": "Creative State",
        "pincode": "123456",
        "country": "Artland",
        "coordinates": {
          "lat": 12.345678,
          "lng": 98.765432
        }
      },
      "participents": []
    },
    // other workshops...
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

### Get Workshop by ID
Retrieves a specific workshop by its ID with artist details.

`GET /workshops/get/:id`

#### Path Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| id | Yes | ID of the workshop to retrieve |

#### Response

**Success (201)**
```json
{
  "success": true,
  "message": "Workshop fetched successfully",
  "workShop": {
    "_id": "workshopId",
    "title": "Workshop Title",
    "description": "Workshop Description",
    "date": "2025-05-15T10:00:00.000Z",
    "type": "Painting",
    "artist": {
      "_id": "artistId",
      "username": "Artist Name",
      "bio": "Artist Bio"
    },
    "image": {
      "secure_url": "https://cloudinary.com/image-url",
      "public_id": "image-public-id"
    },
    "price": 2000,
    "location": {
      "address": "123 Art Street",
      "city": "Artistic City",
      "state": "Creative State",
      "pincode": "123456",
      "country": "Artland",
      "coordinates": {
        "lat": 12.345678,
        "lng": 98.765432
      }
    },
    "participents": 5 // Number of participants instead of the array
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

Create, Update, and Delete endpoints require authentication as an artist. A workshop can only be modified or deleted by the artist who created it.

## Notes

1. The workshop cannot be deleted if it has participants.
2. When retrieving a single workshop, the participants array is replaced with the count of participants.
3. All successful responses for GET, DELETE and UPDATE operations are using status code 201, which is typically used for resource creation. Status code 200 would be more appropriate for these operations.
