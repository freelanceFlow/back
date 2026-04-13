const invoiceService = require('../services/invoice.service');

async function getAll(req, res, next) {
  try {
    const invoices = await invoiceService.findAll(req.user.id);
    res.json(invoices);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const invoice = await invoiceService.findById(req.params.id, req.user.id);
    res.json(invoice);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const invoice = await invoiceService.create(req.body, req.user.id);
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const invoice = await invoiceService.update(req.params.id, req.body, req.user.id);
    res.json(invoice);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await invoiceService.remove(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove };
