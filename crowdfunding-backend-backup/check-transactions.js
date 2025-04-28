require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkTransactions() {
  try {
    console.log('Starting transaction check...');

    // Get campaign ID from command line arguments
    const campaignId = process.argv[2];
    
    if (!campaignId) {
      console.error('Usage: node check-transactions.js <campaignId>');
      process.exit(1);
    }

    console.log(`Checking transactions for campaign #${campaignId}`);

    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'crowdfundingdb'
    });

    console.log('Connected to MySQL database');

    // Get campaign data
    console.log('Getting campaign data...');
    const [campaigns] = await connection.execute(`
      SELECT id, title, donated, donors FROM Campaign WHERE id = ?
    `, [campaignId]);

    if (campaigns.length === 0) {
      console.error(`Campaign #${campaignId} not found`);
      process.exit(1);
    }

    const campaign = campaigns[0];
    console.log(`Campaign #${campaign.id} "${campaign.title}": donated=${campaign.donated}, donors=${campaign.donors}`);

    // Get transaction data
    console.log('\nGetting transaction data...');
    const [transactions] = await connection.execute(`
      SELECT * FROM transactions WHERE campaign_id = ?
    `, [campaignId]);

    console.log(`Found ${transactions.length} transactions for campaign #${campaignId}`);
    
    if (transactions.length > 0) {
      console.log('\nTransaction details:');
      let totalAmount = 0;
      
      transactions.forEach(tx => {
        console.log(`- Transaction #${tx.id}: ${tx.amount} DT (${tx.method}, ${tx.status}, ${tx.created_at})`);
        console.log(`  Payment Reference: ${tx.payment_reference}`);
        console.log(`  Description: ${tx.description}`);
        console.log(`  Donor ID: ${tx.donor_id}`);
        
        if (tx.status === 'COMPLETED') {
          totalAmount += parseFloat(tx.amount);
        }
      });
      
      console.log(`\nTotal from completed transactions: ${totalAmount} DT`);
      console.log(`Current donated amount in database: ${campaign.donated} DT`);
      
      if (totalAmount !== parseFloat(campaign.donated)) {
        console.log('\nDonation amount mismatch detected!');
      } else {
        console.log('\nDonation amount is correct!');
      }
    } else {
      console.log('No transactions found for this campaign');
    }
    
    // Close connection
    await connection.end();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTransactions();
