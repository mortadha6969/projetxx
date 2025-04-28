# Database Fix Instructions

This document provides instructions for fixing database issues in the crowdfunding application.

## Problem Description

The application has several database issues:

1. **Table Inconsistency**: Both singular and plural table names exist (`campaign` and `campaigns`, `user` and `users`)
2. **Column Name Mismatch**: SQL queries use `created_at` but the database uses `createdAt` (or vice versa)
3. **Foreign Key Constraints**: Issues with foreign key constraints between tables
4. **Login Issues**: Problems with user authentication

## Fix Scripts

Several scripts have been created to fix these issues:

### 1. Fix Database Tables

This script fixes the table inconsistency by migrating data from singular tables to plural tables and fixing column names.

```bash
node fix-database.js
```

### 2. Create/Update Admin User

This script creates or updates the admin user with a known password.

```bash
node create-admin-user.js
```

After running this script, you can log in with:
- Email: admin@example.com
- Password: password123

### 3. Create/Update Test User

This script creates or updates a test user with a known password.

```bash
node create-test-user.js
```

After running this script, you can log in with:
- Email: user@gmail.com
- Password: password123

## Manual Fixes

If the scripts don't fully resolve the issues, you may need to perform these manual steps:

### Fix phpMyAdmin Login

If you can't log in to phpMyAdmin:

1. Check your MySQL credentials in the `.env` file
2. Ensure MySQL service is running
3. Try resetting the MySQL root password if needed

### Fix Database Column Names

If you still have issues with column names:

1. Log in to phpMyAdmin
2. Select the `crowdfundingdb` database
3. Check the column names in the `campaigns` and `users` tables
4. Ensure they use snake_case (`created_at`, not `createdAt`)

### Fix Foreign Key Constraints

If foreign key constraints are still causing issues:

1. Log in to phpMyAdmin
2. Select the `crowdfundingdb` database
3. Go to the `transactions` table
4. Check the foreign key constraints
5. Ensure they reference the correct tables (`campaigns`, not `campaign`)

## Troubleshooting

If you encounter issues:

1. Check the server logs for specific error messages
2. Verify database connection settings in `.env` file
3. Ensure all tables have consistent naming (plural form is preferred)
4. Check that column names match between models and database tables

## Contact

If you continue to experience issues, please contact the development team for assistance.
