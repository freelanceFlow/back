const Service = require('../models/service.model');

async function findAll(userId) {
  return Service.findAll({ where: { user_id: userId } });
}

async function findById(id, userId) {
  const service = await Service.findOne({ where: { id, user_id: userId } });
  if (!service) {
    const error = new Error('Service not found');
    error.status = 404;
    throw error;
  }
  return service;
}

async function create(data, userId) {
  return Service.create({ ...data, user_id: userId });
}

async function update(id, data, userId) {
  const service = await findById(id, userId);
  return service.update(data);
}

async function remove(id, userId) {
  const service = await findById(id, userId);
  await service.destroy();
}

module.exports = { findAll, findById, create, update, remove };
