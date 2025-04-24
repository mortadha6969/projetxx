# TrueFunding API Testing with Postman

This guide will help you test the TrueFunding API using Postman.

## Setup

1. Install [Postman](https://www.postman.com/downloads/) if you haven't already.
2. Import the Postman collection and environment files:
   - Open Postman
   - Click on "Import" in the top left corner
   - Drag and drop or select the following files:
     - `TrueFunding-API.postman_collection.json`
     - `TrueFunding-Environment.postman_environment.json`

3. Select the "TrueFunding Environment" from the environment dropdown in the top right corner.

## Starting the Backend Server

Before testing the API, make sure the backend server is running:

```bash
cd crowdfunding-backend
npm install
npm start
```

## Testing the API

### Authentication Flow

1. **Register a User**:
   - Open the "Register User" request in the Authentication folder
   - Click "Send" to register a test user
   - If you get a 400 error about the user already existing, that's okay - proceed to login

2. **Login**:
   - Open the "Login User" request in the Authentication folder
   - Click "Send" to login with the test credentials
   - The response should include a JWT token, which will be automatically saved to the environment variables

### Testing Protected Endpoints

Once you've logged in, you can test the protected endpoints:

1. **Get User Profile**:
   - Open the "Get User Profile" request in the User folder
   - Click "Send" to retrieve the current user's profile

2. **Create a Campaign**:
   - Open the "Create Campaign" request in the Campaigns folder
   - Add an image file by clicking on the "Select Files" button next to the image field
   - Click "Send" to create a new campaign

3. **Make a Donation**:
   - Open the "Make Donation" request in the Transactions folder
   - Update the campaignId if necessary
   - Click "Send" to make a donation

## Troubleshooting

### Authentication Issues

If you encounter 401 Unauthorized errors:

1. Make sure you've successfully logged in
2. Check that the authToken environment variable is set (look in the environment quick look in the top right)
3. Try logging in again to refresh the token

### Server Connection Issues

If you can't connect to the server:

1. Ensure the backend server is running
2. Check that the baseUrl environment variable is set to the correct URL (default: http://localhost:3001)
3. Verify there are no CORS issues by checking the server logs

## API Endpoints Reference

### Authentication
- `POST /users/register` - Register a new user
- `POST /users/login` - Login and get JWT token

### User
- `GET /users/profile` - Get user profile (protected)
- `PUT /users/profile` - Update user profile (protected)
- `PUT /users/change-password` - Change user password (protected)

### Campaigns
- `GET /campaigns` - Get all campaigns
- `GET /campaigns/:id` - Get campaign by ID
- `POST /campaigns` - Create a new campaign (protected)
- `PUT /campaigns/:id` - Update a campaign (protected)
- `DELETE /campaigns/:id` - Delete a campaign (protected)

### Transactions
- `POST /transactions` - Create a new transaction/donation (protected)
- `GET /transactions/user` - Get user transactions (protected)
