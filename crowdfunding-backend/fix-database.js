/**
 * This script fixes database inconsistencies by:
 * 1. Migrating data from singular tables (campaign, user) to plural tables (campaigns, users)
 * 2. Dropping the singular tables
 * 3. Fixing foreign key constraints
 * 4. Fixing column name inconsistencies
 */

require('dotenv').config();
const { sequelize, initializeDatabase } = require('./config/database');

async function fixDatabase() {
  try {
    console.log('Starting database fix process...');
    
    // Initialize database connection
    await initializeDatabase();
    console.log('Database connected successfully');
    
    // Check if both singular and plural tables exist
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('Tables in database:', tables.map(t => Object.values(t)[0]));
    
    const tableNames = tables.map(t => Object.values(t)[0]);
    const hasCampaign = tableNames.includes('campaign');
    const hasCampaigns = tableNames.includes('campaigns');
    const hasUser = tableNames.includes('user');
    const hasUsers = tableNames.includes('users');
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Disable foreign key checks
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction });
      
      // Fix campaign tables
      if (hasCampaign && hasCampaigns) {
        console.log('Both campaign and campaigns tables exist. Migrating data...');
        
        // Get column names from campaigns table
        const [campaignsColumns] = await sequelize.query(
          'SHOW COLUMNS FROM campaigns',
          { transaction }
        );
        
        // Get column names from campaign table
        const [campaignColumns] = await sequelize.query(
          'SHOW COLUMNS FROM campaign',
          { transaction }
        );
        
        console.log('Campaigns columns:', campaignsColumns.map(c => c.Field));
        console.log('Campaign columns:', campaignColumns.map(c => c.Field));
        
        // Check if there's data in the campaign table
        const [campaignCount] = await sequelize.query(
          'SELECT COUNT(*) as count FROM campaign',
          { transaction }
        );
        
        if (campaignCount[0].count > 0) {
          console.log(`Found ${campaignCount[0].count} rows in campaign table`);
          
          // Get common columns between both tables
          const campaignsFields = campaignsColumns.map(c => c.Field);
          const campaignFields = campaignColumns.map(c => c.Field);
          const commonFields = campaignFields.filter(field => campaignsFields.includes(field));
          
          console.log('Common fields:', commonFields);
          
          // Insert data from campaign to campaigns
          const insertQuery = `
            INSERT IGNORE INTO campaigns (${commonFields.join(', ')})
            SELECT ${commonFields.join(', ')} FROM campaign
          `;
          
          console.log('Executing insert query:', insertQuery);
          await sequelize.query(insertQuery, { transaction });
          
          console.log('Data migrated from campaign to campaigns');
        } else {
          console.log('No data in campaign table, skipping migration');
        }
        
        // Drop the campaign table
        await sequelize.query('DROP TABLE IF EXISTS campaign', { transaction });
        console.log('Dropped campaign table');
      } else if (hasCampaign && !hasCampaigns) {
        console.log('Only campaign table exists. Renaming to campaigns...');
        await sequelize.query('RENAME TABLE campaign TO campaigns', { transaction });
        console.log('Renamed campaign table to campaigns');
      } else if (!hasCampaign && hasCampaigns) {
        console.log('Only campaigns table exists. No action needed.');
      } else {
        console.log('No campaign tables found!');
      }
      
      // Fix user tables
      if (hasUser && hasUsers) {
        console.log('Both user and users tables exist. Migrating data...');
        
        // Get column names from users table
        const [usersColumns] = await sequelize.query(
          'SHOW COLUMNS FROM users',
          { transaction }
        );
        
        // Get column names from user table
        const [userColumns] = await sequelize.query(
          'SHOW COLUMNS FROM user',
          { transaction }
        );
        
        console.log('Users columns:', usersColumns.map(c => c.Field));
        console.log('User columns:', userColumns.map(c => c.Field));
        
        // Check if there's data in the user table
        const [userCount] = await sequelize.query(
          'SELECT COUNT(*) as count FROM user',
          { transaction }
        );
        
        if (userCount[0].count > 0) {
          console.log(`Found ${userCount[0].count} rows in user table`);
          
          // Get common columns between both tables
          const usersFields = usersColumns.map(c => c.Field);
          const userFields = userColumns.map(c => c.Field);
          const commonFields = userFields.filter(field => usersFields.includes(field));
          
          console.log('Common fields:', commonFields);
          
          // Insert data from user to users
          const insertQuery = `
            INSERT IGNORE INTO users (${commonFields.join(', ')})
            SELECT ${commonFields.join(', ')} FROM user
          `;
          
          console.log('Executing insert query:', insertQuery);
          await sequelize.query(insertQuery, { transaction });
          
          console.log('Data migrated from user to users');
        } else {
          console.log('No data in user table, skipping migration');
        }
        
        // Drop the user table
        await sequelize.query('DROP TABLE IF EXISTS user', { transaction });
        console.log('Dropped user table');
      } else if (hasUser && !hasUsers) {
        console.log('Only user table exists. Renaming to users...');
        await sequelize.query('RENAME TABLE user TO users', { transaction });
        console.log('Renamed user table to users');
      } else if (!hasUser && hasUsers) {
        console.log('Only users table exists. No action needed.');
      } else {
        console.log('No user tables found!');
      }
      
      // Fix column name inconsistencies in campaigns table
      if (hasCampaigns) {
        console.log('Checking for column name inconsistencies in campaigns table...');
        
        // Check if createdAt exists but created_at doesn't
        const [campaignsColumns] = await sequelize.query(
          'SHOW COLUMNS FROM campaigns',
          { transaction }
        );
        
        const columnNames = campaignsColumns.map(c => c.Field);
        const hasCreatedAt = columnNames.includes('createdAt');
        const hasCreated_at = columnNames.includes('created_at');
        const hasUpdatedAt = columnNames.includes('updatedAt');
        const hasUpdated_at = columnNames.includes('updated_at');
        
        if (hasCreatedAt && !hasCreated_at) {
          console.log('Renaming createdAt to created_at in campaigns table...');
          await sequelize.query('ALTER TABLE campaigns CHANGE createdAt created_at DATETIME', { transaction });
        }
        
        if (hasUpdatedAt && !hasUpdated_at) {
          console.log('Renaming updatedAt to updated_at in campaigns table...');
          await sequelize.query('ALTER TABLE campaigns CHANGE updatedAt updated_at DATETIME', { transaction });
        }
      }
      
      // Fix column name inconsistencies in users table
      if (hasUsers) {
        console.log('Checking for column name inconsistencies in users table...');
        
        // Check if createdAt exists but created_at doesn't
        const [usersColumns] = await sequelize.query(
          'SHOW COLUMNS FROM users',
          { transaction }
        );
        
        const columnNames = usersColumns.map(c => c.Field);
        const hasCreatedAt = columnNames.includes('createdAt');
        const hasCreated_at = columnNames.includes('created_at');
        const hasUpdatedAt = columnNames.includes('updatedAt');
        const hasUpdated_at = columnNames.includes('updated_at');
        
        if (hasCreatedAt && !hasCreated_at) {
          console.log('Renaming createdAt to created_at in users table...');
          await sequelize.query('ALTER TABLE users CHANGE createdAt created_at DATETIME', { transaction });
        }
        
        if (hasUpdatedAt && !hasUpdated_at) {
          console.log('Renaming updatedAt to updated_at in users table...');
          await sequelize.query('ALTER TABLE users CHANGE updatedAt updated_at DATETIME', { transaction });
        }
      }
      
      // Fix foreign key constraints in transactions table
      if (tableNames.includes('transactions')) {
        console.log('Fixing foreign key constraints in transactions table...');
        
        // Drop existing foreign keys
        const [fkConstraints] = await sequelize.query(`
          SELECT CONSTRAINT_NAME
          FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
          WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'transactions'
          AND REFERENCED_TABLE_NAME IS NOT NULL
        `, { transaction });
        
        for (const constraint of fkConstraints) {
          await sequelize.query(`
            ALTER TABLE transactions
            DROP FOREIGN KEY ${constraint.CONSTRAINT_NAME}
          `, { transaction });
          console.log(`Dropped foreign key constraint: ${constraint.CONSTRAINT_NAME}`);
        }
        
        // Add correct foreign key constraints
        await sequelize.query(`
          ALTER TABLE transactions
          ADD CONSTRAINT fk_transaction_user
          FOREIGN KEY (donor_id)
          REFERENCES users(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
        `, { transaction }).catch(err => {
          console.log('Note: Error adding Transaction-User constraint:', err.message);
        });
        
        await sequelize.query(`
          ALTER TABLE transactions
          ADD CONSTRAINT fk_transaction_campaign
          FOREIGN KEY (campaign_id)
          REFERENCES campaigns(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
        `, { transaction }).catch(err => {
          console.log('Note: Error adding Transaction-Campaign constraint:', err.message);
        });
      }
      
      // Fix column name inconsistencies in transactions table
      if (tableNames.includes('transactions')) {
        console.log('Checking for column name inconsistencies in transactions table...');
        
        // Check if createdAt exists but created_at doesn't
        const [transactionsColumns] = await sequelize.query(
          'SHOW COLUMNS FROM transactions',
          { transaction }
        );
        
        const columnNames = transactionsColumns.map(c => c.Field);
        const hasCreatedAt = columnNames.includes('createdAt');
        const hasCreated_at = columnNames.includes('created_at');
        const hasUpdatedAt = columnNames.includes('updatedAt');
        const hasUpdated_at = columnNames.includes('updated_at');
        
        if (hasCreatedAt && !hasCreated_at) {
          console.log('Renaming createdAt to created_at in transactions table...');
          await sequelize.query('ALTER TABLE transactions CHANGE createdAt created_at DATETIME', { transaction });
        }
        
        if (hasUpdatedAt && !hasUpdated_at) {
          console.log('Renaming updatedAt to updated_at in transactions table...');
          await sequelize.query('ALTER TABLE transactions CHANGE updatedAt updated_at DATETIME', { transaction });
        }
      }
      
      // Re-enable foreign key checks
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction });
      
      // Commit transaction
      await transaction.commit();
      console.log('Database fix completed successfully!');
      
      // Verify the tables after fix
      const [tablesAfter] = await sequelize.query('SHOW TABLES');
      console.log('Tables in database after fix:', tablesAfter.map(t => Object.values(t)[0]));
      
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Error fixing database:', error);
      throw error;
    }
    
  } catch (error) {
    console.error('Database fix failed:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed');
  }
}

// Run the fix
fixDatabase();
