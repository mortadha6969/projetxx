# TrueFunding API Guide

This guide provides detailed information about the TrueFunding API endpoints and how to use them.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:3001
```

## Authentication

Most endpoints require authentication using a JWT token. To authenticate:

1. Obtain a token by logging in or registering
2. Include the token in the Authorization header of your requests:
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

## API Endpoints

### Authentication

#### Register a New User

```
POST /users/register
```

**Request Body:**
```json
{
  "username": "testuser",
  "email": "user@example.com",
  "password": "password123",
  "phone": "12345678",
  "birthdate": "1990-01-01"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "user@example.com",
    "phone": "12345678",
    "birthdate": "1990-01-01",
    "createdAt": "2023-04-24T12:00:00.000Z"
  }
}
```

#### Login

```
POST /users/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "user@example.com"
  }
}
```

### User Management

#### Get User Profile

```
GET /users/profile
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "status": "success",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "user@example.com",
    "firstName": "Test",
    "lastName": "User",
    "phone": "12345678",
    "birthdate": "1990-01-01",
    "bio": "I am a test user for the crowdfunding platform.",
    "profileImage": null,
    "createdAt": "2023-04-24T12:00:00.000Z",
    "updatedAt": "2023-04-24T12:00:00.000Z"
  }
}
```

#### Update User Profile

```
PUT /users/profile
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "87654321",
  "bio": "I am a passionate crowdfunding supporter."
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "87654321",
    "birthdate": "1990-01-01",
    "bio": "I am a passionate crowdfunding supporter.",
    "profileImage": null,
    "createdAt": "2023-04-24T12:00:00.000Z",
    "updatedAt": "2023-04-24T12:05:00.000Z"
  }
}
```

#### Change Password

```
PUT /users/change-password
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newPassword123!"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

### Campaigns

#### Get All Campaigns

```
GET /campaigns
```

**Response:**
```json
{
  "status": "success",
  "campaigns": [
    {
      "id": 1,
      "userId": 1,
      "title": "Innovative Tech Gadget",
      "description": "Help us bring this revolutionary gadget to market...",
      "target": 10000,
      "donated": 1500,
      "endDate": "2023-05-24T12:00:00.000Z",
      "imageUrl": null,
      "status": "active",
      "iteration": 1,
      "createdAt": "2023-04-24T12:00:00.000Z",
      "updatedAt": "2023-04-24T12:00:00.000Z",
      "User": {
        "username": "testuser"
      }
    },
    // More campaigns...
  ]
}
```

#### Get Campaign by ID

```
GET /campaigns/:id
```

**Response:**
```json
{
  "status": "success",
  "campaign": {
    "id": 1,
    "userId": 1,
    "title": "Innovative Tech Gadget",
    "description": "Help us bring this revolutionary gadget to market...",
    "target": 10000,
    "donated": 1500,
    "endDate": "2023-05-24T12:00:00.000Z",
    "imageUrl": null,
    "status": "active",
    "iteration": 1,
    "createdAt": "2023-04-24T12:00:00.000Z",
    "updatedAt": "2023-04-24T12:00:00.000Z",
    "User": {
      "username": "testuser",
      "email": "user@example.com"
    }
  }
}
```

#### Create Campaign

```
POST /campaigns
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data
```

**Form Data:**
```
title: Test Campaign
description: This is a test campaign created for demonstration purposes.
target: 1000
endDate: 2023-12-31
category: Technology
image: [file upload]
```

**Response:**
```json
{
  "status": "success",
  "message": "Campaign created successfully",
  "campaign": {
    "id": 4,
    "userId": 1,
    "title": "Test Campaign",
    "description": "This is a test campaign created for demonstration purposes.",
    "target": 1000,
    "donated": 0,
    "endDate": "2023-12-31T00:00:00.000Z",
    "imageUrl": "/uploads/campaign-1-1682337600000.jpg",
    "status": "active",
    "iteration": 1,
    "createdAt": "2023-04-24T12:00:00.000Z",
    "updatedAt": "2023-04-24T12:00:00.000Z"
  }
}
```

#### Update Campaign

```
PUT /campaigns/:id
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data
```

**Form Data:**
```
title: Updated Campaign Title
description: This is an updated campaign description.
target: 2000
image: [file upload]
```

**Response:**
```json
{
  "status": "success",
  "message": "Campaign updated successfully",
  "campaign": {
    "id": 1,
    "userId": 1,
    "title": "Updated Campaign Title",
    "description": "This is an updated campaign description.",
    "target": 2000,
    "donated": 1500,
    "endDate": "2023-05-24T12:00:00.000Z",
    "imageUrl": "/uploads/campaign-1-1682337700000.jpg",
    "status": "active",
    "iteration": 1,
    "createdAt": "2023-04-24T12:00:00.000Z",
    "updatedAt": "2023-04-24T12:05:00.000Z"
  }
}
```

#### Delete Campaign

```
DELETE /campaigns/:id
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "status": "success",
  "message": "Campaign deleted successfully"
}
```

### Transactions

#### Make Donation

```
POST /transactions
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "campaignId": 1,
  "amount": 50
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Donation successful",
  "transaction": {
    "id": 7,
    "amount": 50,
    "donorId": 1,
    "campaignId": 1,
    "status": "COMPLETED",
    "createdAt": "2023-04-24T12:10:00.000Z",
    "updatedAt": "2023-04-24T12:10:00.000Z"
  }
}
```

#### Get User Transactions

```
GET /transactions/user
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "status": "success",
  "transactions": [
    {
      "id": 1,
      "amount": 200,
      "donorId": 1,
      "campaignId": 2,
      "status": "COMPLETED",
      "createdAt": "2023-04-24T12:00:00.000Z",
      "updatedAt": "2023-04-24T12:00:00.000Z",
      "Campaign": {
        "title": "Community Garden Project"
      }
    },
    // More transactions...
  ]
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

### 400 Bad Request

```json
{
  "status": "error",
  "message": "All fields are required: username, email, password, phone, and birthdate"
}
```

### 401 Unauthorized

```json
{
  "status": "error",
  "message": "Invalid email or password"
}
```

### 404 Not Found

```json
{
  "status": "error",
  "message": "Campaign not found"
}
```

### 500 Internal Server Error

```json
{
  "status": "error",
  "message": "Failed to process donation"
}
```

## Testing with Postman

For easy testing, import the provided Postman collection and environment files:

1. `TrueFunding-API.postman_collection.json`
2. `TrueFunding-Environment.postman_environment.json`

See the `POSTMAN-GUIDE.md` file for detailed instructions on using Postman with this API.
