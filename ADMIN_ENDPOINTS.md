# Admin Endpoints Reference

## 🔐 Admin Authentication Endpoints

### Base URL
- **Local**: `http://localhost:8080/api/admin`
- **Production**: `https://your-backend.onrender.com/api/admin`

---

## 📋 Admin Login Flow

### Step 1: Admin Login
**Endpoint**: `POST /api/admin/auth/login`

**Request Body**:
```json
{
  "username": "admin",
  "password": "admin_password"
}
```

**Response** (2FA Required):
```json
{
  "requiresTwoFactor": true,
  "qrCodeUrl": "data:image/png;base64,...",
  "username": "admin"
}
```

**Response** (2FA Not Required):
```json
{
  "token": "jwt_token_here",
  "username": "admin",
  "role": "ADMIN",
  "email": "admin@example.com"
}
```

---

### Step 2: Verify 2FA (If Required)
**Endpoint**: `POST /api/admin/auth/verify-2fa`

**Request Body**:
```json
{
  "username": "admin",
  "code": "123456"
}
```

**Response**:
```json
{
  "token": "jwt_token_here",
  "username": "admin",
  "role": "ADMIN",
  "email": "admin@example.com"
}
```

---

### Step 3: Validate Admin Token
**Endpoint**: `GET /api/admin/auth/validate`

**Headers**:
```
Authorization: Bearer jwt_token_here
```

**Response**:
```json
{
  "username": "admin",
  "role": "ADMIN",
  "email": "admin@example.com"
}
```

---

## 👥 Admin Management Endpoints

### Get All Users
**Endpoint**: `GET /api/admin/users`

**Headers**: `Authorization: Bearer token`

**Response**: Array of users

---

### Get User by ID
**Endpoint**: `GET /api/admin/users/{id}`

**Headers**: `Authorization: Bearer token`

**Response**: User object

---

### Delete User
**Endpoint**: `DELETE /api/admin/users/{id}`

**Headers**: `Authorization: Bearer token`

**Response**: 200 OK

---

### Update User Status
**Endpoint**: `PUT /api/admin/users/{id}/status`

**Headers**: `Authorization: Bearer token`

**Request Body**:
```json
"ACTIVE" | "INACTIVE" | "SUSPENDED"
```

**Response**: Updated user object

---

## 🎯 Regular User Endpoints

### User Login
**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "username": "user",
  "password": "password"
}
```

**Response**:
```json
{
  "token": "jwt_token_here",
  "username": "user",
  "role": "USER",
  "email": "user@example.com"
}
```

---

### User Registration
**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password"
}
```

**Response**:
```json
{
  "message": "User registered successfully"
}
```

---

## 🔗 Frontend Admin Routes

### Admin Pages
- **Login**: `/admin/login`
- **Dashboard**: `/admin/dashboard`
- **Users**: `/admin/users`
- **Items**: `/admin/items`
- **Categories**: `/admin/categories`
- **Bids**: `/admin/bids`
- **Results**: `/admin/results`
- **Notifications**: `/admin/notifications`

---

## 📝 Important Notes

1. **Admin Access**: Requires ADMIN role
2. **2FA**: First-time login requires 2FA setup
3. **JWT Token**: Use Bearer token in Authorization header
4. **CORS**: Configured to allow frontend origin

---

## 🚀 Testing Endpoints

### Using cURL

**Admin Login**:
```bash
curl -X POST http://localhost:8080/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin_password"}'
```

**Validate Token**:
```bash
curl -X GET http://localhost:8080/api/admin/auth/validate \
  -H "Authorization: Bearer your_token_here"
```

---

## ✅ Deployment Checklist

- [ ] Admin login working
- [ ] 2FA setup complete
- [ ] Token validation working
- [ ] User management endpoints accessible
- [ ] CORS configured correctly
- [ ] JWT secret set in production

Good luck! 🎉

