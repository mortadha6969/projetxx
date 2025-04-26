require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkCampaignDonation() {
  try {
    console.log('Starting campaign donation check...');

    // Get campaign ID from command line arguments
    const campaignId = process.argv[2];
    
    if (!campaignId) {
      console.error('Usage: node check-campaign-donation.js <campaignId>');
      process.exit(1);
    }

    console.log(`Checking campaign #${campaignId}`);

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
      SELECT id, amount, method, status, created_at FROM transactions WHERE campaign_id = ?
    `, [campaignId]);

    console.log(`Found ${transactions.length} transactions for campaign #${campaignId}`);
    
    if (transactions.length > 0) {
      console.log('\nTransaction details:');
      let totalAmount = 0;
      
      transactions.forEach(tx => {
        console.log(`- Transaction #${tx.id}: ${tx.amount} DT (${tx.method}, ${tx.status}, ${tx.created_at})`);
        if (tx.status === 'COMPLETED') {
          totalAmount += parseFloat(tx.amount);
        }
      });
      
      console.log(`\nTotal from completed transactions: ${totalAmount} DT`);
      console.log(`Current donated amount in database: ${campaign.donated} DT`);
      
      if (totalAmount !== parseFloat(campaign.donated)) {
        console.log('\nDonation amount mismatch detected!');
        
        // Ask if user wants to update the campaign
        console.log('\nDo you want to update the campaign with the correct amount? (y/n)');
        process.stdin.once('data', async (data) => {
          const answer = data.toString().trim().toLowerCase();
          
          if (answer === 'y' || answer === 'yes') {
            console.log(`Updating campaign #${campaignId} with donated amount ${totalAmount}...`);
            
            await connection.execute(`
              UPDATE Campaign 
              SET donated = ?, donors = ?, updatedAt = NOW()
              WHERE id = ?
            `, [totalAmount, transactions.length, campaignId]);
            
            console.log('Campaign updated successfully');
            
            // Verify update
            const [updatedCampaigns] = await connection.execute(`
              SELECT id, title, donated, donors FROM Campaign WHERE id = ?
            `, [campaignId]);
            
            const updatedCampaign = updatedCampaigns[0];
            console.log(`Updated campaign data: donated=${updatedCampaign.donated}, donors=${updatedCampaign.donors}`);
          } else {
            console.log('Update cancelled');
          }
          
          // Close connection
          await connection.end();
          console.log('Database connection closed');
          process.exit(0);
        });
      } else {
        console.log('\nDonation amount is correct!');
        // Close connection
        await connection.end();
        console.log('Database connection closed');
        process.exit(0);
      }
    } else {
      console.log('No transactions found for this campaign');
      // Close connection
      await connection.end();
      console.log('Database connection closed');
      process.exit(0);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCampaignDonation();
