require('dotenv').config();
const mysql = require('mysql2/promise');

async function monitorCampaign() {
  try {
    console.log('Starting campaign monitor...');

    // Get campaign ID from command line arguments
    const campaignId = process.argv[2];
    
    if (!campaignId) {
      console.error('Usage: node monitor-campaign.js <campaignId>');
      process.exit(1);
    }

    console.log(`Monitoring campaign #${campaignId}`);

    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'crowdfundingdb'
    });

    console.log('Connected to MySQL database');

    // Function to check campaign data
    const checkCampaign = async () => {
      // Get campaign data
      const [campaigns] = await connection.execute(`
        SELECT id, title, donated, donors FROM Campaign WHERE id = ?
      `, [campaignId]);

      if (campaigns.length === 0) {
        console.error(`Campaign #${campaignId} not found`);
        return;
      }

      const campaign = campaigns[0];
      console.log(`\n[${new Date().toISOString()}] Campaign #${campaign.id} "${campaign.title}"`);
      console.log(`Donated: ${campaign.donated} DT, Donors: ${campaign.donors}`);

      // Get all completed transactions for this campaign
      const [transactions] = await connection.execute(`
        SELECT id, amount, status FROM transactions 
        WHERE campaign_id = ? AND status = 'COMPLETED'
      `, [campaignId]);

      console.log(`Found ${transactions.length} completed transactions`);

      if (transactions.length > 0) {
        // Calculate total donation amount
        let totalDonated = 0;
        transactions.forEach(tx => {
          totalDonated += parseFloat(tx.amount);
        });

        console.log(`Total from transactions: ${totalDonated} DT`);
        
        if (parseFloat(campaign.donated) !== totalDonated || parseInt(campaign.donors) !== transactions.length) {
          console.log('MISMATCH DETECTED!');
          console.log(`Database: donated=${campaign.donated}, donors=${campaign.donors}`);
          console.log(`Calculated: donated=${totalDonated}, donors=${transactions.length}`);
        } else {
          console.log('Campaign data is correct');
        }
      }
    };

    // Check campaign data immediately
    await checkCampaign();

    // Check campaign data every 5 seconds
    setInterval(async () => {
      await checkCampaign();
    }, 5000);

    // Keep the script running
    console.log('\nMonitoring campaign data every 5 seconds. Press Ctrl+C to stop.');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

monitorCampaign();
