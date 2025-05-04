'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if the column already exists
      const tableInfo = await queryInterface.describeTable('campaigns');
      if (!tableInfo.document_url) {
        // Add the document_url column if it doesn't exist
        await queryInterface.addColumn('campaigns', 'document_url', {
          type: Sequelize.STRING,
          allowNull: true,
          after: 'files' // Add it after the files column
        });
        console.log('document_url column added successfully to campaigns table');
      } else {
        console.log('document_url column already exists in campaigns table');
      }
    } catch (error) {
      console.error('Error adding document_url column:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove the column
      await queryInterface.removeColumn('campaigns', 'document_url');
      console.log('document_url column removed from campaigns table');
    } catch (error) {
      console.error('Error removing document_url column:', error);
      throw error;
    }
  }
};
