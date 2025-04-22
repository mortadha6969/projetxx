# Crowdfunding Backend

This is the backend API for the crowdfunding platform.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /users/register` - Register a new user
- `POST /users/login` - Login and get JWT token

### Campaigns

- `GET /campaigns` - Get all campaigns
- `GET /campaigns/:id` - Get campaign by ID
- `POST /campaigns` - Create a new campaign (requires authentication)
- `PUT /campaigns/:id` - Update campaign (requires authentication)
- `DELETE /campaigns/:id` - Delete campaign (requires authentication)

### Transactions

- `POST /transactions` - Make a donation (requires authentication)
- `GET /transactions/user/:userId` - Get user donations (requires authentication)
- `GET /transactions/campaign/:campaignId` - Get campaign donations

## API Versioning

The API also supports versioned endpoints with the `/api` prefix:

- `/api/users/...`
- `/api/campaigns/...`
- `/api/transactions/...`

## Troubleshooting

If you encounter any issues, try the following:

1. Make sure MySQL is running
2. Check your `.env` file for correct database credentials
3. Try running with the direct script:
   ```
   npm run run
   ```
   or for development with auto-reload:
   ```
   npm run dev:run
   ```
