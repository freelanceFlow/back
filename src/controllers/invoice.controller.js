const invoiceService = require('../services/invoice.service');
const pdfService = require('../services/pdf.service');
const emailService = require('../services/email.service');

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

async function getPdf(req, res, next) {
  try {
    const { doc, invoiceNumber } = await pdfService.generateInvoicePdf(req.params.id, req.user.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${invoiceNumber}.pdf"`);
    doc.pipe(res);
  } catch (error) {
    next(error);
  }
}

async function sendEmail(req, res, next) {
  try {
    const { doc, invoiceNumber } = await pdfService.generateInvoicePdf(req.params.id, req.user.id);
    const invoice = await invoiceService.findById(req.params.id, req.user.id);

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));

    await new Promise((resolve, reject) => {
      doc.on('end', resolve);
      doc.on('error', reject);
    });

    const pdfBuffer = Buffer.concat(chunks);

    const data = await emailService.sendInvoiceEmail({
      to: invoice.Client.email,
      clientName: invoice.Client.name,
      invoiceNumber,
      pdfBuffer,
    });

    res.json({ message: 'Invoice sent successfully', emailId: data.id });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove, getPdf, sendEmail };
