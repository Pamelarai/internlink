# Backend Utils & API Documentation

This folder contains the standardized API endpoints and utilities for the InternLink backend.

## Files

### 📁 Utils Files (`src/utils/`)

#### 1. **validation.js**
Centralized validation utilities for all request data.
- `validateEmail()` - Validates email format
- `validatePassword()` - Checks password minimum length (6 chars)
- `validateRequired()` - Checks if all fields are provided
- `validateSignupIntern()` - Validates intern signup data
- `validateSignupProvider()` - Validates provider signup data
- `validateLogin()` - Validates login credentials
- `isValidUrl()` - Validates URL format

#### 2. **auth.js**
Authentication-related utilities.
- `hashPassword()` - Hash passwords using bcryptjs
- `comparePassword()` - Compare plain password with hash
- `generateToken()` - Create JWT tokens with 7-day expiration
- `verifyToken()` - Verify and decode JWT tokens

#### 3. **response.js**
Standardized response formatting for consistent API responses.
- `successResponse()` - Format success responses
- `errorResponse()` - Format error responses
- `sendSuccess()` - Send success response with status code
- `sendError()` - Send error response with status code
- `sendValidationError()` - Send validation error response (422)

### 📄 API Documentation Files (`api/`)

#### 1. **endpoints.rest**
Main API documentation with all available endpoints:
- POST `/api/auth/login` - User login
- POST `/api/intern/signup` - Register as intern
- POST `/api/provider/signup` - Register as provider

Includes request/response examples and error response formats.

#### 2. **auth.test.rest**
Test cases for authentication endpoints:
- Successful login
- Missing email validation
- Invalid email format
- Wrong credentials

#### 3. **signup.test.rest**
Test cases for signup endpoints:
- Successful intern signup
- Missing required fields
- Weak password validation
- Successful provider signup
- Optional fields handling
- Invalid URL validation
- Duplicate email handling

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "timestamp": "2025-12-29T10:30:00.000Z"
}
```

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["error1", "error2"],
  "statusCode": 422,
  "timestamp": "2025-12-29T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400,
  "timestamp": "2025-12-29T10:30:00.000Z"
}
```

## Usage Examples

### In Controllers
```javascript
import { validateLogin } from '../utils/validation.js'
import { comparePassword, generateToken } from '../utils/auth.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const login = async (req, res) => {
  const { isValid, errors } = validateLogin(req.body)
  if (!isValid) return sendValidationError(res, errors)
  
  // ... business logic ...
  
  return sendSuccess(res, data, 'Login successful')
}
```

## Testing

Use the `.rest` files with VS Code REST Client extension:
1. Install "REST Client" extension (humao.rest-client)
2. Open any `.rest` file
3. Click "Send Request" above each endpoint

## Notes

- All passwords are hashed with bcryptjs (10 salt rounds)
- JWT tokens expire after 7 days
- Email validation uses regex pattern
- Passwords must be at least 6 characters
- URLs must be valid for provider website field
