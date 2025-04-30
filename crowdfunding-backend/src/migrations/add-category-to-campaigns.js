// migrations/add-category-to-campaigns.js
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

async function addCategoryToCampaigns() {
  try {
    console.log('Starting migration: Add category column to campaigns table');
    
    // Check if the column already exists
    const checkColumnQuery = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'campaigns' 
      AND COLUMN_NAME = 'category'
    `;
    
    const columns = await sequelize.query(checkColumnQuery, { type: QueryTypes.SELECT });
    
    if (columns.length === 0) {
      // Column doesn't exist, add it
      console.log('Category column does not exist. Adding it...');
      
      const addColumnQuery = `
        ALTER TABLE campaigns 
        ADD COLUMN category VARCHAR(255) NOT NULL DEFAULT 'General'
      `;
      
      await sequelize.query(addColumnQuery);
      console.log('✅ Category column added successfully');
    } else {
      console.log('✅ Category column already exists');
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

module.exports = addCategoryToCampaigns;
