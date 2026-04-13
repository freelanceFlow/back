const clientService = require('../services/client.service');

async function getAll(req, res, next) {
  try {
    const clients = await clientService.findAll(req.user.id);
    res.json(clients);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const client = await clientService.findById(req.params.id, req.user.id);
    res.json(client);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const client = await clientService.create(req.body, req.user.id);
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const client = await clientService.update(req.params.id, req.body, req.user.id);
    res.json(client);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await clientService.remove(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove };
