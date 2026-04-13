const Client = require('../models/client.model');

async function findAll(userId) {
  return Client.findAll({ where: { user_id: userId } });
}

async function findById(id, userId) {
  const client = await Client.findOne({ where: { id, user_id: userId } });
  if (!client) {
    const error = new Error('Client not found');
    error.status = 404;
    throw error;
  }
  return client;
}

async function create(data, userId) {
  return Client.create({ ...data, user_id: userId });
}

async function update(id, data, userId) {
  const client = await findById(id, userId);
  return client.update(data);
}

async function remove(id, userId) {
  const client = await findById(id, userId);
  await client.destroy();
}

module.exports = { findAll, findById, create, update, remove };
