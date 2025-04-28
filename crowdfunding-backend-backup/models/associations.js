// models/associations.js
const User = require('./User');
const Campaign = require('./Campaign');
const Transaction = require('./Transaction');

// User associations
User.hasMany(Campaign, { 
  foreignKey: 'userId',
  as: 'campaigns'
});

User.hasMany(Transaction, { 
  foreignKey: 'donorId',
  as: 'donations'
});

// Campaign associations
Campaign.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'creator'
});

Campaign.hasMany(Transaction, { 
  foreignKey: 'campaignId',
  as: 'transactions'
});

// Transaction associations
Transaction.belongsTo(User, { 
  foreignKey: 'donorId',
  as: 'donor'
});

Transaction.belongsTo(Campaign, { 
  foreignKey: 'campaignId',
  as: 'campaign'
});

module.exports = {
  User,
  Campaign,
  Transaction
};
