/**
 * Script to fix database issues
 * - Drops duplicate tables (singular forms)
 * - Ensures all data is in the plural tables
 * - Fixes foreign key constraints
 */

require('dotenv').config();
const { sequelize, initializeDatabase } = require('./config/database');

async function fixDatabase() {
  try {
    console.log('Starting database fix process...');
    
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connected successfully');
    
    // Start transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Disable foreign key checks temporarily
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction });
      
      // Get all tables
      const [tables] = await sequelize.query('SHOW TABLES', { transaction });
      console.log('Tables in database:', tables.map(t => Object.values(t)[0]));
      
      // Check if both campaign and campaigns tables exist
      const hasUserTable = tables.some(t => Object.values(t)[0] === 'user');
      const hasUsersTable = tables.some(t => Object.values(t)[0] === 'users');
      const hasCampaignTable = tables.some(t => Object.values(t)[0] === 'campaign');
      const hasCampaignsTable = tables.some(t => Object.values(t)[0] === 'campaigns');
      
      // Fix user tables
      if (hasUserTable && hasUsersTable) {
        console.log('Both user and users tables exist. Migrating data...');
        
        // Check if user table has data
        const [userCount] = await sequelize.query('SELECT COUNT(*) as count FROM user', { transaction });
        if (userCount[0].count > 0) {
          console.log(`Found ${userCount[0].count} rows in user table. Migrating to users table...`);
          
          // Get columns from users table
          const [usersColumns] = await sequelize.query('SHOW COLUMNS FROM users', { transaction });
          const userColumns = usersColumns.map(col => col.Field);
          
          // Get data from user table
          const [userData] = await sequelize.query('SELECT * FROM user', { transaction });
          
          // Insert data into users table
          for (const user of userData) {
            // Map camelCase to snake_case
            const mappedUser = {
              id: user.id,
              username: user.username,
              email: user.email,
              password: user.password,
              first_name: user.firstName,
              last_name: user.lastName,
              phone: user.phone,
              birthdate: user.birthdate,
              bio: user.bio,
              profile_image: user.profileImage,
              role: user.role,
              created_at: user.createdAt,
              updated_at: user.updatedAt
            };
            
            // Check if user already exists in users table
            const [existingUser] = await sequelize.query(
              'SELECT id FROM users WHERE id = ?',
              { 
                replacements: [user.id],
                transaction 
              }
            );
            
            if (existingUser.length === 0) {
              // Insert user into users table
              await sequelize.query(
                `INSERT INTO users (
                  id, username, email, password, first_name, last_name, 
                  phone, birthdate, bio, profile_image, role, created_at, updated_at
                ) VALUES (
                  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                )`,
                { 
                  replacements: [
                    mappedUser.id, mappedUser.username, mappedUser.email, mappedUser.password,
                    mappedUser.first_name, mappedUser.last_name, mappedUser.phone, mappedUser.birthdate,
                    mappedUser.bio, mappedUser.profile_image, mappedUser.role || 'user',
                    mappedUser.created_at, mappedUser.updated_at
                  ],
                  transaction 
                }
              );
              console.log(`Migrated user with ID ${user.id}`);
            } else {
              console.log(`User with ID ${user.id} already exists in users table. Skipping.`);
            }
          }
        } else {
          console.log('No data in user table. No migration needed.');
        }
        
        // Drop user table
        await sequelize.query('DROP TABLE user', { transaction });
        console.log('Dropped user table');
      } else if (hasUserTable) {
        console.log('Only user table exists. Renaming to users...');
        await sequelize.query('RENAME TABLE user TO users', { transaction });
        console.log('Renamed user table to users');
      } else if (hasUsersTable) {
        console.log('Only users table exists. No action needed.');
      }
      
      // Fix campaign tables
      if (hasCampaignTable && hasCampaignsTable) {
        console.log('Both campaign and campaigns tables exist. Migrating data...');
        
        // Check if campaign table has data
        const [campaignCount] = await sequelize.query('SELECT COUNT(*) as count FROM campaign', { transaction });
        if (campaignCount[0].count > 0) {
          console.log(`Found ${campaignCount[0].count} rows in campaign table. Migrating to campaigns table...`);
          
          // Get columns from campaigns table
          const [campaignsColumns] = await sequelize.query('SHOW COLUMNS FROM campaigns', { transaction });
          const campaignColumns = campaignsColumns.map(col => col.Field);
          
          // Get data from campaign table
          const [campaignData] = await sequelize.query('SELECT * FROM campaign', { transaction });
          
          // Insert data into campaigns table
          for (const campaign of campaignData) {
            // Map camelCase to snake_case
            const mappedCampaign = {
              id: campaign.id,
              user_id: campaign.userId,
              title: campaign.title,
              description: campaign.description,
              target: campaign.target,
              donated: campaign.donated,
              donors: campaign.donors,
              end_date: campaign.endDate,
              image_url: campaign.imageUrl,
              status: campaign.status,
              iteration: campaign.iteration,
              previous_iteration_id: campaign.previousIterationId,
              iteration_end_reason: campaign.iterationEndReason,
              files: campaign.files,
              created_at: campaign.createdAt,
              updated_at: campaign.updatedAt
            };
            
            // Check if campaign already exists in campaigns table
            const [existingCampaign] = await sequelize.query(
              'SELECT id FROM campaigns WHERE id = ?',
              { 
                replacements: [campaign.id],
                transaction 
              }
            );
            
            if (existingCampaign.length === 0) {
              // Insert campaign into campaigns table
              await sequelize.query(
                `INSERT INTO campaigns (
                  id, user_id, title, description, target, donated, donors,
                  end_date, image_url, status, iteration, previous_iteration_id,
                  iteration_end_reason, files, created_at, updated_at
                ) VALUES (
                  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                )`,
                { 
                  replacements: [
                    mappedCampaign.id, mappedCampaign.user_id, mappedCampaign.title, mappedCampaign.description,
                    mappedCampaign.target, mappedCampaign.donated, mappedCampaign.donors, mappedCampaign.end_date,
                    mappedCampaign.image_url, mappedCampaign.status, mappedCampaign.iteration,
                    mappedCampaign.previous_iteration_id, mappedCampaign.iteration_end_reason,
                    mappedCampaign.files, mappedCampaign.created_at, mappedCampaign.updated_at
                  ],
                  transaction 
                }
              );
              console.log(`Migrated campaign with ID ${campaign.id}`);
            } else {
              console.log(`Campaign with ID ${campaign.id} already exists in campaigns table. Skipping.`);
            }
          }
        } else {
          console.log('No data in campaign table. No migration needed.');
        }
        
        // Drop campaign table
        await sequelize.query('DROP TABLE campaign', { transaction });
        console.log('Dropped campaign table');
      } else if (hasCampaignTable) {
        console.log('Only campaign table exists. Renaming to campaigns...');
        await sequelize.query('RENAME TABLE campaign TO campaigns', { transaction });
        console.log('Renamed campaign table to campaigns');
      } else if (hasCampaignsTable) {
        console.log('Only campaigns table exists. No action needed.');
      }
      
      // Check for column name inconsistencies in campaigns table
      if (hasCampaignsTable) {
        console.log('Checking for column name inconsistencies in campaigns table...');
        const [campaignsColumns] = await sequelize.query('SHOW COLUMNS FROM campaigns', { transaction });
        
        // Check if we need to rename columns from camelCase to snake_case
        const camelCaseColumns = campaignsColumns.filter(col => 
          col.Field.match(/[A-Z]/) && !col.Field.includes('_')
        );
        
        if (camelCaseColumns.length > 0) {
          console.log(`Found ${camelCaseColumns.length} camelCase columns in campaigns table. Converting to snake_case...`);
          
          for (const col of camelCaseColumns) {
            // Convert camelCase to snake_case
            const snakeCase = col.Field.replace(/([A-Z])/g, '_$1').toLowerCase();
            
            // Rename column
            await sequelize.query(
              `ALTER TABLE campaigns CHANGE ${col.Field} ${snakeCase} ${col.Type}`,
              { transaction }
            );
            console.log(`Renamed column ${col.Field} to ${snakeCase}`);
          }
        } else {
          console.log('No column name inconsistencies found in campaigns table.');
        }
      }
      
      // Check for column name inconsistencies in users table
      if (hasUsersTable) {
        console.log('Checking for column name inconsistencies in users table...');
        const [usersColumns] = await sequelize.query('SHOW COLUMNS FROM users', { transaction });
        
        // Check if we need to rename columns from camelCase to snake_case
        const camelCaseColumns = usersColumns.filter(col => 
          col.Field.match(/[A-Z]/) && !col.Field.includes('_')
        );
        
        if (camelCaseColumns.length > 0) {
          console.log(`Found ${camelCaseColumns.length} camelCase columns in users table. Converting to snake_case...`);
          
          for (const col of camelCaseColumns) {
            // Convert camelCase to snake_case
            const snakeCase = col.Field.replace(/([A-Z])/g, '_$1').toLowerCase();
            
            // Rename column
            await sequelize.query(
              `ALTER TABLE users CHANGE ${col.Field} ${snakeCase} ${col.Type}`,
              { transaction }
            );
            console.log(`Renamed column ${col.Field} to ${snakeCase}`);
          }
        } else {
          console.log('No column name inconsistencies found in users table.');
        }
      }
      
      // Fix foreign key constraints in transactions table
      console.log('Fixing foreign key constraints in transactions table...');
      
      // Get foreign key constraints
      const [foreignKeys] = await sequelize.query(`
        SELECT CONSTRAINT_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'transactions'
        AND REFERENCED_TABLE_NAME IS NOT NULL
      `, { transaction });
      
      // Drop existing foreign key constraints
      for (const fk of foreignKeys) {
        await sequelize.query(`
          ALTER TABLE transactions
          DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}
        `, { transaction });
        console.log(`Dropped foreign key constraint: ${fk.CONSTRAINT_NAME}`);
      }
      
      // Add new foreign key constraints
      await sequelize.query(`
        ALTER TABLE transactions
        ADD CONSTRAINT fk_transaction_user
        FOREIGN KEY (donor_id)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
      `, { transaction });
      
      await sequelize.query(`
        ALTER TABLE transactions
        ADD CONSTRAINT fk_transaction_campaign
        FOREIGN KEY (campaign_id)
        REFERENCES campaigns(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
      `, { transaction });
      
      // Check for column name inconsistencies in transactions table
      console.log('Checking for column name inconsistencies in transactions table...');
      const [transactionsColumns] = await sequelize.query('SHOW COLUMNS FROM transactions', { transaction });
      
      // Check if we need to rename columns from camelCase to snake_case
      const camelCaseColumns = transactionsColumns.filter(col => 
        col.Field.match(/[A-Z]/) && !col.Field.includes('_')
      );
      
      if (camelCaseColumns.length > 0) {
        console.log(`Found ${camelCaseColumns.length} camelCase columns in transactions table. Converting to snake_case...`);
        
        for (const col of camelCaseColumns) {
          // Convert camelCase to snake_case
          const snakeCase = col.Field.replace(/([A-Z])/g, '_$1').toLowerCase();
          
          // Rename column
          await sequelize.query(
            `ALTER TABLE transactions CHANGE ${col.Field} ${snakeCase} ${col.Type}`,
            { transaction }
          );
          console.log(`Renamed column ${col.Field} to ${snakeCase}`);
        }
      } else {
        console.log('No column name inconsistencies found in transactions table.');
      }
      
      // Re-enable foreign key checks
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction });
      
      // Commit transaction
      await transaction.commit();
      console.log('Database fix completed successfully!');
      
      // Get final tables
      const [finalTables] = await sequelize.query('SHOW TABLES');
      console.log('Tables in database after fix:', finalTables.map(t => Object.values(t)[0]));
      
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Error fixing database:', error);
      throw error;
    }
    
  } catch (error) {
    console.error('Error fixing database:', error);
  } finally {
    // Close database connection
    await sequelize.close();
    console.log('Database connection closed');
  }
}

// Run the function
fixDatabase();
