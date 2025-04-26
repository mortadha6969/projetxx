require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixCampaignDonations() {
  try {
    console.log('Starting campaign donation fix...');

    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'crowdfundingdb'
    });

    console.log('Connected to MySQL database');

    // Get all campaigns
    console.log('Getting all campaigns...');
    const [campaigns] = await connection.execute(`
      SELECT id, title, donated, donors FROM Campaign
    `);

    console.log(`Found ${campaigns.length} campaigns`);

    // Process each campaign
    for (const campaign of campaigns) {
      console.log(`\nProcessing campaign #${campaign.id} "${campaign.title}"`);
      console.log(`Current values: donated=${campaign.donated}, donors=${campaign.donors}`);

      // Get all completed transactions for this campaign
      const [transactions] = await connection.execute(`
        SELECT id, amount, status FROM transactions 
        WHERE campaign_id = ? AND status = 'COMPLETED'
      `, [campaign.id]);

      console.log(`Found ${transactions.length} completed transactions`);

      if (transactions.length > 0) {
        // Calculate total donation amount
        let totalDonated = 0;
        transactions.forEach(tx => {
          totalDonated += parseFloat(tx.amount);
        });

        console.log(`Total from transactions: ${totalDonated} DT`);
        console.log(`Current donated amount: ${campaign.donated} DT`);

        if (totalDonated !== parseFloat(campaign.donated) || transactions.length !== parseInt(campaign.donors)) {
          console.log('Mismatch detected! Updating campaign...');

          // Update campaign
          await connection.execute(`
            UPDATE Campaign 
            SET donated = ?, donors = ?, updatedAt = NOW()
            WHERE id = ?
          `, [totalDonated, transactions.length, campaign.id]);

          console.log('Campaign updated successfully');

          // Verify update
          const [updatedCampaigns] = await connection.execute(`
            SELECT id, title, donated, donors FROM Campaign WHERE id = ?
          `, [campaign.id]);

          const updatedCampaign = updatedCampaigns[0];
          console.log(`Updated values: donated=${updatedCampaign.donated}, donors=${updatedCampaign.donors}`);
        } else {
          console.log('Campaign donation amount is correct');
        }
      } else {
        console.log('No completed transactions found');
        
        // Reset donation amount to 0 if there are no completed transactions
        if (parseFloat(campaign.donated) > 0 || parseInt(campaign.donors) > 0) {
          console.log('Resetting donation amount to 0...');
          
          await connection.execute(`
            UPDATE Campaign 
            SET donated = 0, donors = 0, updatedAt = NOW()
            WHERE id = ?
          `, [campaign.id]);
          
          console.log('Campaign reset successfully');
        }
      }
    }

    // Close connection
    await connection.end();
    console.log('\nDatabase connection closed');
    console.log('Campaign donation fix completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixCampaignDonations();
