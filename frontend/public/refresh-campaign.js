// This script forces a refresh of the campaign data
(function() {
  // Function to refresh the campaign data
  function refreshCampaignData() {
    console.log('Refreshing campaign data...');
    
    // Get the current URL
    const url = window.location.href;
    
    // Check if we're on a campaign page
    if (url.includes('/campaign/')) {
      console.log('On campaign page, forcing refresh...');
      
      // Force a reload of the page
      window.location.reload(true);
    }
  }
  
  // Add a refresh button to the page
  function addRefreshButton() {
    // Check if we're on a campaign page
    if (window.location.href.includes('/campaign/')) {
      console.log('Adding refresh button to campaign page...');
      
      // Create a button element
      const button = document.createElement('button');
      button.innerText = 'Force Refresh Campaign Data';
      button.style.position = 'fixed';
      button.style.bottom = '20px';
      button.style.right = '20px';
      button.style.zIndex = '9999';
      button.style.padding = '10px 15px';
      button.style.backgroundColor = '#f97316';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '5px';
      button.style.cursor = 'pointer';
      button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
      
      // Add click event listener
      button.addEventListener('click', function() {
        refreshCampaignData();
      });
      
      // Add the button to the page
      document.body.appendChild(button);
    }
  }
  
  // Wait for the page to load
  window.addEventListener('load', function() {
    // Add the refresh button after a short delay
    setTimeout(addRefreshButton, 1000);
  });
})();
