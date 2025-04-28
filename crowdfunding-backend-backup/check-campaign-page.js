require('dotenv').config();
const axios = require('axios');

async function checkCampaignPage() {
  try {
    console.log('Starting campaign page check...');

    // Get campaign ID from command line arguments
    const campaignId = process.argv[2];

    if (!campaignId) {
      console.error('Usage: node check-campaign-page.js <campaignId>');
      process.exit(1);
    }

    console.log(`Checking campaign page for campaign #${campaignId}`);

    // Make API request to get campaign details
    const apiUrl = `http://localhost:3001/api/campaigns/${campaignId}`;
    console.log(`Making API request to: ${apiUrl}`);

    // Try alternative endpoints if the first one fails
    const alternativeUrls = [
      `http://localhost:3001/campaigns/${campaignId}`,
      `http://localhost:3001/api/campaign/${campaignId}`
    ];

    let response;
    let campaign;

    try {
      response = await axios.get(apiUrl);
      campaign = response.data;
    } catch (error) {
      console.log(`Failed to fetch from ${apiUrl}: ${error.message}`);

      // Try alternative URLs
      let success = false;
      for (const url of alternativeUrls) {
        try {
          console.log(`Trying alternative URL: ${url}`);
          response = await axios.get(url);
          campaign = response.data;
          console.log(`Successfully fetched from ${url}`);
          success = true;
          break;
        } catch (altError) {
          console.log(`Failed to fetch from ${url}: ${altError.message}`);
        }
      }

      if (!success) {
        throw new Error('Failed to fetch campaign data from all endpoints');
      }
    }

    console.log('\nCampaign details:');
    console.log(`- ID: ${campaign.id}`);
    console.log(`- Title: ${campaign.title}`);
    console.log(`- Donated: ${campaign.donated} DT`);
    console.log(`- Donors: ${campaign.donors}`);
    console.log(`- Target: ${campaign.target} DT`);
    console.log(`- Progress: ${((campaign.donated / campaign.target) * 100).toFixed(2)}%`);

    console.log('\nCheck completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

checkCampaignPage();
