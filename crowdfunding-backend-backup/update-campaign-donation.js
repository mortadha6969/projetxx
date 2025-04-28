require('dotenv').config();
const mysql = require('mysql2/promise');

async function updateCampaignDonation() {
  try {
    console.log('Starting campaign donation update...');

    // Get campaign ID from command line arguments
    const campaignId = process.argv[2];
    const donationAmount = process.argv[3];
    
    if (!campaignId || !donationAmount) {
      console.error('Usage: node update-campaign-donation.js <campaignId> <donationAmount>');
      process.exit(1);
    }

    console.log(`Updating campaign #${campaignId} with donation amount ${donationAmount}`);

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

    // Calculate new values
    const newDonated = parseFloat(campaign.donated) + parseFloat(donationAmount);
    const newDonors = parseInt(campaign.donors) + 1;

    console.log(`New values: donated=${newDonated}, donors=${newDonors}`);

    // Update campaign
    console.log('Updating campaign...');
    await connection.execute(`
      UPDATE Campaign 
      SET donated = ?, donors = ?, updatedAt = NOW()
      WHERE id = ?
    `, [newDonated, newDonors, campaignId]);

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

updateCampaignDonation();
