# Authentication API

Authentication API for managing user registration, verification, login, and password recovery.

## Endpoints

### Sign Up
Registers a new user (artist, customer, or admin).

`POST /auth/signup`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| username | String | Yes | User's display name |
| password | String | Yes | User's password |
| mobile | String | Yes | User's mobile number |
| email | String | Yes | User's email address |
| role | String | Yes | User role: "artist", "customer", or "admin" |
| bio | String | Yes (for artists) | Artist biography |
| socialLinks | Object | No (for artists) | Artist's social media links |
| adminSecret | String | Yes (for admins) | Secret key for admin registration |

#### Response

**Success (201)**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Error (400, 403, 500)**
```json
{
  "success": false,
  "message": "Error message"
}
```

### Email Verification
Verifies user email with OTP.

`POST /auth/verify-mail`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | String | Yes | Email address used for registration |
| otp | String | Yes | One-time password received via email |

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Account verified successfully"
}
```

**Error (400, 404, 500)**
```json
{
  "success": false,
  "message": "Error message"
}
```

### Login
Authenticates user and provides JWT token.

`POST /auth/login`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | String | Yes | User's email address |
| password | String | Yes | User's password |

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Login successful"
}
```
*Note: JWT token is set as an HTTP-only cookie*

**Error (400, 404, 500)**
```json
{
  "success": false,
  "message": "Error message"
}
```

### Forgot Password
Sends OTP for password reset.

`POST /auth/forgot-password`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | String | Yes | User's email address |

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Error (400, 404, 500)**
```json
{
  "success": false,
  "message": "Error message"
}
```

## Additional Information

- New users must verify their email address with OTP before login
- JWT tokens expire after 1 minute
- Admin registration requires valid admin secret (stored in environment variables)
