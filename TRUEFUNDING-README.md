# TrueFunding - Crowdfunding Platform

A modern, full-stack crowdfunding platform built with Node.js, Express, React, and MySQL/SQLite.

## Features

- **User Authentication**: Secure registration and login system
- **Campaign Management**: Create, view, and manage fundraising campaigns
- **Multiple Image Uploads**: Support for multiple images per campaign
- **Responsive Design**: Works on desktop and mobile devices
- **Donation System**: Support campaigns with secure donations
- **User Profiles**: Customizable user profiles with profile pictures

## Project Structure

This project is organized into two main parts:

- **Backend**: Node.js/Express API with Sequelize ORM
- **Frontend**: React application with modern UI components

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL (optional, can use SQLite instead)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/truefunding.git
   cd truefunding
   ```

2. Install all dependencies:
   ```
   node install-dependencies.js
   ```

   This script will install all required dependencies for both the backend and frontend.

### Configuration

1. Backend configuration:
   - Create a `.env` file in the `crowdfunding-backend` directory
   - Use the following template:
     ```
     # Server Configuration
     PORT=3001
     NODE_ENV=development

     # Database Configuration
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=crowdfundingdb
     DB_PORT=3306

     # Database Fallback
     USE_SQLITE=true  # Set to true to use SQLite instead of MySQL

     # JWT Configuration
     JWT_SECRET=your_jwt_secret_key_here
     JWT_EXPIRE=24h

     # File Upload Configuration
     MAX_FILE_SIZE=5242880
     UPLOAD_PATH=uploads/

     # CORS Configuration
     ALLOWED_ORIGINS=http://localhost:3000
     ```

2. Frontend configuration:
   - Create a `.env` file in the `frontend` directory
   - Use the following template:
     ```
     REACT_APP_API_URL=http://localhost:3001
     REACT_APP_NAME=TrueFunding
     REACT_APP_VERSION=1.0.0
     ```

### Running the Application

1. Start the backend server:
   ```
   cd crowdfunding-backend
   npm start
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Test User Account

A test user has been created for you to use:

- **Email**: user@gmail.com
- **Password**: password123

These credentials are pre-filled in the login form for your convenience.

## Creating a New User

You can register a new user through the registration form. The form generates a unique username and email using a timestamp to avoid conflicts with existing users.

## Creating a Campaign

Once logged in, you can create a campaign by navigating to the Create Campaign page. The form is pre-filled with test data for your convenience.

## Database Options

The application supports two database engines:

1. **MySQL** (default): A robust relational database management system
2. **SQLite** (fallback): A lightweight file-based database that requires no server

To use SQLite (if you don't have MySQL installed):

```
cd crowdfunding-backend
node use-sqlite.js
```

## API Documentation

For detailed API documentation, see the `API-GUIDE.md` file.

### Testing with Postman

For easy API testing, import the provided Postman collection and environment files:

1. Import `TrueFunding-API.postman_collection.json`
2. Import `TrueFunding-Environment.postman_environment.json`
3. Set the environment to "TrueFunding Environment"

See the `POSTMAN-GUIDE.md` file for detailed instructions.

### Main Endpoints

#### Authentication
- `POST /users/register` - Register a new user
- `POST /users/login` - Login and get JWT token

#### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `PUT /users/change-password` - Change user password

#### Campaigns
- `GET /campaigns` - Get all campaigns
- `GET /campaigns/:id` - Get campaign by ID
- `POST /campaigns` - Create a new campaign
- `PUT /campaigns/:id` - Update a campaign
- `DELETE /campaigns/:id` - Delete a campaign

#### Transactions
- `POST /transactions` - Create a new transaction (donation)
- `GET /transactions/user` - Get user transactions

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

If you encounter database issues:

1. Stop the backend server
2. Delete the database.sqlite file in the crowdfunding-backend directory
3. Restart the backend server - it will create a new database

### API Connection Issues

If the frontend can't connect to the backend:

1. Make sure the backend is running on port 3001
2. Check that the frontend is configured to connect to http://localhost:3001
3. Verify that CORS is properly configured in the backend

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
