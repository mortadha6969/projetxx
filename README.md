# TrueFunding - Crowdfunding Platform

A full-stack crowdfunding platform built with Node.js, Express, React, and MySQL/SQLite.

## Project Structure

This project consists of two main parts:

- **Backend**: Node.js/Express API with Sequelize ORM
- **Frontend**: React application

## Features

- User authentication (register, login, profile management)
- Campaign creation and management
- Multiple image uploads for campaigns
- Donation system
- Responsive design

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

2. Install backend dependencies:
   ```
   cd crowdfunding-backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

   Alternatively, you can use the provided script to install frontend dependencies:
   ```
   cd ../frontend
   node install-dependencies.js
   ```

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

You can start both the backend and frontend servers with a single command:

```
node start-app.js
```

Or you can start them separately:

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

## Database Options

The application supports two database engines:

1. **MySQL** (default): A robust relational database management system
2. **SQLite** (fallback): A lightweight file-based database that requires no server

To switch to SQLite (if you don't have MySQL installed):

```
cd crowdfunding-backend
node use-sqlite.js
```

## API Endpoints

### Authentication
- `POST /users/register` - Register a new user
- `POST /users/login` - Login and get JWT token

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `PUT /users/change-password` - Change user password

### Campaigns
- `GET /campaigns` - Get all campaigns
- `GET /campaigns/:id` - Get campaign by ID
- `POST /campaigns` - Create a new campaign
- `PUT /campaigns/:id` - Update a campaign
- `DELETE /campaigns/:id` - Delete a campaign

### Transactions
- `POST /transactions` - Create a new transaction (donation)
- `GET /transactions/user` - Get user transactions

## Troubleshooting

### Backend Issues

1. **Database Connection Errors**:
   - Make sure your MySQL server is running (if using MySQL)
   - Check your database credentials in the `.env` file
   - Try switching to SQLite using `node use-sqlite.js`

2. **Missing Dependencies**:
   - Run `npm install` in the backend directory

### Frontend Issues

1. **Missing Dependencies**:
   - Run `node install-dependencies.js` in the frontend directory
   - Or manually install with `npm install axios react-router-dom react-hook-form react-icons react-toastify`

2. **API Connection Issues**:
   - Make sure the backend server is running
   - Check that the `REACT_APP_API_URL` in the frontend `.env` file matches your backend URL

## License

This project is licensed under the MIT License.
