require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixDuplicateTransactions() {
  try {
    console.log('Starting duplicate transaction fix...');

    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'crowdfundingdb'
    });

    console.log('Connected to MySQL database');

    // Get all transactions
    console.log('Getting all transactions...');
    const [transactions] = await connection.execute(`
      SELECT id, payment_reference, campaign_id, amount, status, created_at 
      FROM transactions 
      ORDER BY payment_reference, created_at
    `);

    console.log(`Found ${transactions.length} transactions`);

    // Group transactions by payment reference
    const transactionsByRef = {};
    transactions.forEach(tx => {
      if (!transactionsByRef[tx.payment_reference]) {
        transactionsByRef[tx.payment_reference] = [];
      }
      transactionsByRef[tx.payment_reference].push(tx);
    });

    // Find duplicates
    let duplicatesFound = 0;
    const duplicates = [];
    
    for (const [paymentRef, txs] of Object.entries(transactionsByRef)) {
      if (txs.length > 1) {
        duplicatesFound++;
        console.log(`\nFound ${txs.length} transactions with payment reference: ${paymentRef}`);
        
        txs.forEach((tx, index) => {
          console.log(`  ${index + 1}. ID: ${tx.id}, Campaign: ${tx.campaign_id}, Amount: ${tx.amount}, Status: ${tx.status}, Created: ${tx.created_at}`);
        });
        
        // Keep the first transaction, mark others for deletion
        const keepTx = txs[0];
        const deleteTxs = txs.slice(1);
        
        duplicates.push({
          paymentRef,
          keep: keepTx,
          delete: deleteTxs
        });
      }
    }

    console.log(`\nFound ${duplicatesFound} payment references with duplicate transactions`);
    
    if (duplicatesFound > 0) {
      console.log('\nDo you want to fix these duplicates? (y/n)');
      process.stdin.once('data', async (data) => {
        const answer = data.toString().trim().toLowerCase();
        
        if (answer === 'y' || answer === 'yes') {
          console.log('\nFixing duplicate transactions...');
          
          // Process each duplicate
          for (const dup of duplicates) {
            console.log(`\nFixing duplicates for payment reference: ${dup.paymentRef}`);
            console.log(`Keeping transaction ID: ${dup.keep.id}`);
            
            // Delete duplicate transactions
            for (const tx of dup.delete) {
              console.log(`Deleting transaction ID: ${tx.id}`);
              await connection.execute(`
                DELETE FROM transactions WHERE id = ?
              `, [tx.id]);
            }
          }
          
          console.log('\nAll duplicates fixed');
          
          // Now fix campaign donation amounts
          console.log('\nUpdating campaign donation amounts...');
          
          // Get all campaigns
          const [campaigns] = await connection.execute(`
            SELECT id, title, donated, donors FROM Campaign
          `);
          
          for (const campaign of campaigns) {
            console.log(`\nProcessing campaign #${campaign.id} "${campaign.title}"`);
            
            // Get all completed transactions for this campaign
            const [txs] = await connection.execute(`
              SELECT id, amount, status FROM transactions 
              WHERE campaign_id = ? AND status = 'COMPLETED'
            `, [campaign.id]);
            
            if (txs.length > 0) {
              // Calculate total donation amount
              let totalDonated = 0;
              txs.forEach(tx => {
                totalDonated += parseFloat(tx.amount);
              });
              
              console.log(`Current donated: ${campaign.donated}, Current donors: ${campaign.donors}`);
              console.log(`Calculated donated: ${totalDonated}, Calculated donors: ${txs.length}`);
              
              // Update campaign
              await connection.execute(`
                UPDATE Campaign 
                SET donated = ?, donors = ?, updatedAt = NOW()
                WHERE id = ?
              `, [totalDonated, txs.length, campaign.id]);
              
              console.log('Campaign updated');
            }
          }
          
          console.log('\nAll campaigns updated');
        } else {
          console.log('Operation cancelled');
        }
        
        // Close connection
        await connection.end();
        console.log('\nDatabase connection closed');
        process.exit(0);
      });
    } else {
      console.log('No duplicates found, nothing to fix');
      await connection.end();
      console.log('Database connection closed');
      process.exit(0);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixDuplicateTransactions();
