const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

async function sendInvoiceEmail({ to, clientName, invoiceNumber, pdfBuffer }) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Facture ${invoiceNumber}`,
    html: `
      <h2>Bonjour ${clientName},</h2>
      <p>Veuillez trouver ci-joint votre facture <strong>${invoiceNumber}</strong>.</p>
      <p>N'hésitez pas à nous contacter pour toute question.</p>
      <p>Cordialement</p>
    `,
    attachments: [
      {
        filename: `${invoiceNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  if (error) {
    const err = new Error(`Failed to send email: ${error.message}`);
    err.status = 502;
    throw err;
  }

  return data;
}

module.exports = { sendInvoiceEmail };
