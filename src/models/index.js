const sequelize = require('../config/database');

// Models will be imported and associations declared here as features are implemented
// const User = require('./user.model');
// const Client = require('./client.model');
// const Service = require('./service.model');
// const Invoice = require('./invoice.model');
// const InvoiceLine = require('./invoiceLine.model');

// --- Associations ---
// User.hasMany(Client, { foreignKey: 'user_id', onDelete: 'CASCADE' });
// Client.belongsTo(User, { foreignKey: 'user_id' });
// ...

module.exports = {
  sequelize,
  // User,
  // Client,
  // Service,
  // Invoice,
  // InvoiceLine,
};
