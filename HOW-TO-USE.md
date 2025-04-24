# How to Use the Crowdfunding Platform

This guide will help you use the crowdfunding platform with the test user account that has been set up.

## Starting the Application

1. **Start the Backend Server**:
   ```
   cd crowdfunding-backend
   npm start
   ```

2. **Start the Frontend Server**:
   ```
   cd frontend
   npm start
   ```

3. **Access the Application**:
   Open your browser and navigate to: http://localhost:3000

## Test User Credentials

A test user has been created for you to use:

- **Email**: user@gmail.com
- **Password**: password123

These credentials are pre-filled in the login form for your convenience.

## Using the Application

### Login

1. Navigate to the Login page (http://localhost:3000/login)
2. The form should be pre-filled with the test user credentials
3. Click "Sign In" to log in

### Register a New User

If you want to create a new user:

1. Navigate to the Register page (http://localhost:3000/register)
2. The form is pre-filled with test data that includes a timestamp to ensure uniqueness
3. Click "Create Account" to register
4. You'll be redirected to the login page after successful registration

### Create a Campaign

Once logged in:

1. Navigate to the Create Campaign page (http://localhost:3000/create-campaign)
2. The form is pre-filled with test data
3. Upload at least one image for your campaign
4. Click "Create Campaign" to submit

### View Campaigns

1. Navigate to the Campaigns page (http://localhost:3000/campaign)
2. You should see a list of all campaigns
3. Click on a campaign to view its details

## Troubleshooting

### Login Issues

If you encounter login issues:

1. Make sure the backend server is running
2. Check that you're using the correct credentials (user@gmail.com / password123)
3. If needed, you can create a new test user by running:
   ```
   cd crowdfunding-backend
   node create-test-user.js
   ```

### Database Issues

The application uses SQLite by default. If you encounter database issues:

1. Stop the backend server
2. Delete the database.sqlite file in the crowdfunding-backend directory
3. Restart the backend server - it will create a new database

### API Connection Issues

If the frontend can't connect to the backend:

1. Make sure the backend is running on port 3001
2. Check that the frontend is configured to connect to http://localhost:3001
3. Verify that CORS is properly configured in the backend

## Next Steps

Now that you have the application running, you can:

1. Create multiple campaigns
2. Test the user registration process
3. Explore the campaign details page
4. Update your user profile

Enjoy using the crowdfunding platform!
