require('dotenv').config();
const mysql = require('mysql2/promise');

async function setCampaignDonation() {
  try {
    console.log('Starting campaign donation update...');

    // Get campaign ID and donation amount from command line arguments
    const campaignId = process.argv[2];
    const donationAmount = process.argv[3];
    const donorsCount = process.argv[4] || 1;
    
    if (!campaignId || !donationAmount) {
      console.error('Usage: node set-campaign-donation.js <campaignId> <donationAmount> [donorsCount]');
      process.exit(1);
    }

    console.log(`Setting campaign #${campaignId} donation amount to ${donationAmount} DT with ${donorsCount} donors`);

    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'crowdfundingdb'
    });

    console.log('Connected to MySQL database');

    // Get current campaign data
    console.log('Getting current campaign data...');
    const [campaigns] = await connection.execute(`
      SELECT id, title, donated, donors FROM Campaign WHERE id = ?
    `, [campaignId]);

    if (campaigns.length === 0) {
      console.error(`Campaign #${campaignId} not found`);
      process.exit(1);
    }

    const campaign = campaigns[0];
    console.log(`Current campaign data: donated=${campaign.donated}, donors=${campaign.donors}`);

    // Update campaign
    console.log('Updating campaign...');
    await connection.execute(`
      UPDATE Campaign 
      SET donated = ?, donors = ?, updatedAt = NOW()
      WHERE id = ?
    `, [donationAmount, donorsCount, campaignId]);

    console.log('Campaign updated successfully');

    // Verify update
    console.log('Verifying update...');
    const [updatedCampaigns] = await connection.execute(`
      SELECT id, title, donated, donors FROM Campaign WHERE id = ?
    `, [campaignId]);

    const updatedCampaign = updatedCampaigns[0];
    console.log(`Updated campaign data: donated=${updatedCampaign.donated}, donors=${updatedCampaign.donors}`);

    // Close connection
    await connection.end();

    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setCampaignDonation();
