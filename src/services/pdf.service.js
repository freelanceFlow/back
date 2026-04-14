const PDFDocument = require('pdfkit');
const { Invoice, InvoiceLine, Client, Service, User } = require('../models');

async function generateInvoicePdf(invoiceId, userId) {
  const invoice = await Invoice.findOne({
    where: { id: invoiceId, user_id: userId },
    include: [
      { model: Client },
      { model: InvoiceLine, include: [{ model: Service }] },
      {
        model: User,
        attributes: [
          'id',
          'first_name',
          'last_name',
          'email',
          'address_line1',
          'address_line2',
          'zip_code',
          'city',
          'country',
        ],
      },
    ],
  });

  if (!invoice) {
    const error = new Error('Invoice not found');
    error.status = 404;
    throw error;
  }

  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  const user = invoice.User;
  const client = invoice.Client;
  const lines = invoice.InvoiceLines || [];

  doc.fontSize(20).text('FACTURE', { align: 'right' });
  doc.moveDown(0.5);

  doc.fontSize(10);
  doc.text(`${user.first_name} ${user.last_name}`, 50, 80);
  doc.text(user.email);
  if (user.address_line1) doc.text(user.address_line1);
  if (user.address_line2) doc.text(user.address_line2);
  if (user.zip_code || user.city) doc.text(`${user.zip_code ?? ''} ${user.city ?? ''}`.trim());
  if (user.country) doc.text(user.country);

  const invoiceNumber = `INV-${String(invoice.id).padStart(5, '0')}`;
  const issuedDate = invoice.issued_at
    ? new Date(invoice.issued_at).toLocaleDateString('fr-FR')
    : '-';

  doc.text(`Facture N: ${invoiceNumber}`, 350, 80);
  doc.text(`Date: ${issuedDate}`, 350);
  doc.text(`Statut: ${invoice.status}`, 350);

  doc.moveDown(2);
  const clientY = 160;
  doc.fontSize(12).text('Client', 50, clientY);
  doc.fontSize(10);
  doc.text(client.name);
  if (client.company) doc.text(client.company);
  if (client.address_line1) doc.text(client.address_line1);
  if (client.address_line2) doc.text(client.address_line2);
  if (client.zip_code || client.city)
    doc.text(`${client.zip_code ?? ''} ${client.city ?? ''}`.trim());
  if (client.country) doc.text(client.country);
  doc.text(client.email);

  const tableTop = 260;
  const col = { label: 50, qty: 280, price: 360, total: 460 };

  doc.fontSize(10).font('Helvetica-Bold');
  doc.text('Service', col.label, tableTop);
  doc.text('Qty', col.qty, tableTop);
  doc.text('Prix unit.', col.price, tableTop);
  doc.text('Total', col.total, tableTop);

  doc
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  doc.font('Helvetica');
  let y = tableTop + 25;

  for (const line of lines) {
    const label = line.Service ? line.Service.label : `Service #${line.service_id}`;
    doc.text(label, col.label, y, { width: 220 });
    doc.text(String(parseFloat(line.quantity)), col.qty, y);
    doc.text(`${parseFloat(line.unit_price).toFixed(2)} EUR`, col.price, y);
    doc.text(`${parseFloat(line.total).toFixed(2)} EUR`, col.total, y);
    y += 20;
  }

  doc
    .moveTo(50, y + 5)
    .lineTo(550, y + 5)
    .stroke();

  const tvaAmount = (parseFloat(invoice.total_ttc) - parseFloat(invoice.total_ht)).toFixed(2);

  y += 20;
  doc.font('Helvetica-Bold');
  doc.text('Total HT:', col.price, y);
  doc.text(`${parseFloat(invoice.total_ht).toFixed(2)} EUR`, col.total, y);

  y += 20;
  doc.font('Helvetica');
  doc.text(`TVA (${parseFloat(invoice.tva_rate)}%):`, col.price, y);
  doc.text(`${tvaAmount} EUR`, col.total, y);

  y += 20;
  doc.font('Helvetica-Bold');
  doc.text('Total TTC:', col.price, y);
  doc.text(`${parseFloat(invoice.total_ttc).toFixed(2)} EUR`, col.total, y);

  doc.end();
  return { doc, invoiceNumber };
}

module.exports = { generateInvoicePdf };
