require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkCampaignSchema() {
  try {
    console.log('Starting campaign schema check...');

    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'crowdfundingdb'
    });

    console.log('Connected to MySQL database');

    // Check Campaign table schema
    console.log('Checking Campaign table schema...');
    const [columns] = await connection.execute(`
      SHOW COLUMNS FROM Campaign
    `);

    console.log('Campaign table columns:');
    columns.forEach(column => {
      console.log(`- ${column.Field}: ${column.Type} (${column.Null === 'YES' ? 'NULL' : 'NOT NULL'}) ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
    });

    // Check if donated and donors columns exist
    const donatedColumn = columns.find(col => col.Field === 'donated');
    const donorsColumn = columns.find(col => col.Field === 'donors');

    if (donatedColumn) {
      console.log('✅ donated column exists');
    } else {
      console.log('❌ donated column does not exist');
    }

    if (donorsColumn) {
      console.log('✅ donors column exists');
    } else {
      console.log('❌ donors column does not exist');
    }

    // Check sample campaign data
    console.log('\nChecking sample campaign data...');
    const [campaigns] = await connection.execute(`
      SELECT id, title, donated, donors FROM Campaign LIMIT 5
    `);

    console.log('Sample campaign data:');
    campaigns.forEach(campaign => {
      console.log(`- Campaign #${campaign.id} "${campaign.title}": donated=${campaign.donated}, donors=${campaign.donors}`);
    });

    // Close connection
    await connection.end();

    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCampaignSchema();
