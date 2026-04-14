const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const invoiceController = require('../controllers/invoice.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', invoiceController.getAll);
router.get('/export', invoiceController.exportCsv);
router.get('/:id', invoiceController.getById);
router.get('/:id/pdf', invoiceController.getPdf);
router.post('/', invoiceController.create);
router.put('/:id', invoiceController.update);
router.delete('/:id', invoiceController.remove);

module.exports = router;
