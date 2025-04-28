# Crowdfunding Backend

This is the backend API for the Crowdfunding platform. It provides endpoints for user authentication, campaign management, donations, and more.

## Project Structure

```
crowdfunding-backend/
├── src/                  # Source code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Middleware functions
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry point
├── uploads/              # Uploaded files
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL or SQLite

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Set up the database:
   ```
   npm run setup
   ```
5. Start the server:
   ```
   npm start
   ```
   
For development with auto-restart:
```
npm run dev
```

## API Endpoints

### Authentication
- `POST /users/register` - Register a new user
- `POST /users/login` - Login and get JWT token

### Users
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile
- `PUT /users/change-password` - Change password

### Campaigns
- `GET /campaigns` - Get all campaigns
- `GET /campaigns/:id` - Get campaign by ID
- `POST /campaigns` - Create a new campaign
- `PUT /campaigns/:id` - Update a campaign
- `DELETE /campaigns/:id` - Delete a campaign

### Transactions
- `GET /transactions` - Get all transactions (admin only)
- `GET /transactions/:id` - Get transaction by ID
- `POST /transactions/:id/process` - Process a transaction
- `POST /transactions/:id/refund` - Refund a transaction

### Konnect Payment
- `POST /konnect/init-payment` - Initialize a payment
- `GET /konnect/payment/:paymentRef` - Get payment details
- `GET /konnect/verify/:paymentRef` - Verify payment status
- `POST /konnect/webhook` - Handle payment webhook

### Admin
- `GET /admin/users` - Get all users
- `GET /admin/users/:id` - Get user by ID
- `PUT /admin/users/:id` - Update a user
- `DELETE /admin/users/:id` - Delete a user
- `GET /admin/campaigns` - Get all campaigns
- `DELETE /admin/campaigns/:id` - Delete a campaign
- `GET /admin/dashboard` - Get dashboard statistics

## Environment Variables

- `NODE_ENV` - Environment (development, production)
- `DB_HOST` - Database host
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `DB_PORT` - Database port
- `USE_SQLITE` - Use SQLite instead of MySQL (true/false)
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRE` - JWT expiration time
- `MAX_FILE_SIZE` - Maximum file upload size
- `UPLOAD_PATH` - Path for uploaded files
- `ALLOWED_ORIGINS` - CORS allowed origins
- `KONNECT_API_URL` - Konnect API URL
- `KONNECT_API_KEY` - Konnect API key
- `KONNECT_RECEIVER_WALLET_ID` - Konnect wallet ID
- `FRONTEND_URL` - Frontend URL
- `BACKEND_URL` - Backend URL
