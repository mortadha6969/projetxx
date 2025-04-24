# Testing the TrueFunding API with Postman

This guide will help you test the TrueFunding API using Postman.

## Setting Up the Backend

Before testing the API, you need to set up the backend server:

1. **Install Dependencies**:
   ```
   cd crowdfunding-backend
   npm install
   ```

2. **Set Up the Database**:
   ```
   npm run setup
   ```
   This will create a SQLite database and populate it with test data.

3. **Start the Server**:
   ```
   npm start
   ```
   The server will start on port 3001.

## Testing with Postman

### 1. Authentication

#### Register a New User

- **Method**: POST
- **URL**: http://localhost:3001/users/register
- **Body** (raw JSON):
  ```json
  {
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "Password123!",
    "phone": "12345678",
    "birthdate": "1990-01-01"
  }
  ```

#### Login

- **Method**: POST
- **URL**: http://localhost:3001/users/login
- **Body** (raw JSON):
  ```json
  {
    "email": "user@gmail.com",
    "password": "password123"
  }
  ```
- **Response**: Save the token from the response for use in authenticated requests.

### 2. User Management

#### Get User Profile

- **Method**: GET
- **URL**: http://localhost:3001/users/profile
- **Headers**:
  - Authorization: Bearer YOUR_TOKEN_HERE

#### Update User Profile

- **Method**: PUT
- **URL**: http://localhost:3001/users/profile
- **Headers**:
  - Authorization: Bearer YOUR_TOKEN_HERE
- **Body** (raw JSON):
  ```json
  {
    "firstName": "Updated",
    "lastName": "User",
    "bio": "This is my updated bio"
  }
  ```

### 3. Campaign Management

#### Get All Campaigns

- **Method**: GET
- **URL**: http://localhost:3001/campaigns

#### Get Campaign by ID

- **Method**: GET
- **URL**: http://localhost:3001/campaigns/1

#### Create Campaign

- **Method**: POST
- **URL**: http://localhost:3001/campaigns
- **Headers**:
  - Authorization: Bearer YOUR_TOKEN_HERE
- **Body** (form-data):
  - title: Test Campaign
  - description: This is a test campaign
  - target: 1000
  - endDate: 2023-12-31
  - image: [file upload]

#### Update Campaign

- **Method**: PUT
- **URL**: http://localhost:3001/campaigns/1
- **Headers**:
  - Authorization: Bearer YOUR_TOKEN_HERE
- **Body** (form-data):
  - title: Updated Campaign
  - description: This is an updated campaign
  - target: 2000

#### Delete Campaign

- **Method**: DELETE
- **URL**: http://localhost:3001/campaigns/1
- **Headers**:
  - Authorization: Bearer YOUR_TOKEN_HERE

### 4. Transactions

#### Make a Donation

- **Method**: POST
- **URL**: http://localhost:3001/transactions
- **Headers**:
  - Authorization: Bearer YOUR_TOKEN_HERE
- **Body** (raw JSON):
  ```json
  {
    "campaignId": 1,
    "amount": 100
  }
  ```

#### Get User Transactions

- **Method**: GET
- **URL**: http://localhost:3001/transactions/user
- **Headers**:
  - Authorization: Bearer YOUR_TOKEN_HERE

## Test User Credentials

A test user has been created for you to use:

- **Email**: user@gmail.com
- **Password**: password123

## Troubleshooting

### Common Issues

1. **401 Unauthorized**:
   - Make sure you're using the correct token
   - Check that the token hasn't expired
   - Verify that you're including the "Bearer " prefix in the Authorization header

2. **404 Not Found**:
   - Check that the URL is correct
   - Verify that the resource (e.g., campaign ID) exists

3. **500 Internal Server Error**:
   - Check the server logs for more information
   - Verify that the database is properly set up

### Resetting the Database

If you encounter database issues, you can reset the database:

```
npm run setup
```

This will drop all tables and recreate them with fresh test data.
