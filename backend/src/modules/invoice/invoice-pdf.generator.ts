import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { join } from 'path';
import type { Order } from '../order/entities/order.entity.js';

const NAVY = '#1B3A57';
const RED = '#E0212B';
const GRAY = '#A6A6A6';

export function generateInvoicePdf(
  invoiceNumber: string,
  order: Order,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileName = `${invoiceNumber}.pdf`;
    const filePath = join(process.cwd(), 'uploads', 'invoices', fileName);

    const doc = new PDFDocument({ margin: 50 });
    const stream = createWriteStream(filePath);
    doc.pipe(stream);

    // ---- En-tête ----
    doc
      .fontSize(22)
      .fillColor(NAVY)
      .text('iDeal Tech', 50, 50, { continued: true })
      .fillColor(RED)
      .text(' Tech', { continued: false });

    doc
      .fontSize(9)
      .fillColor(GRAY)
      .text('Grossiste & détaillant en matériel informatique', 50, 78)
      .text('Tunis, Tunisie — contact@idealtech.tn', 50, 90)
      .text('Matricule fiscal : XXXXXXX', 50, 102);

    doc
      .fontSize(16)
      .fillColor(NAVY)
      .text(`Facture ${invoiceNumber}`, 300, 50, { align: 'right' });
    doc
      .fontSize(9)
      .fillColor(GRAY)
      .text(`Date d'émission : ${new Date().toLocaleDateString('fr-FR')}`, 300, 75, {
        align: 'right',
      })
      .text(`Commande : ${order.order_number}`, 300, 88, { align: 'right' });

    doc.moveTo(50, 130).lineTo(545, 130).strokeColor('#E5E7EB').stroke();

    // ---- Infos client ----
    doc
      .fontSize(10)
      .fillColor(NAVY)
      .text('Facturé à :', 50, 145);
    doc
      .fontSize(10)
      .fillColor('#2E2E2E')
      .text(order.customer_name, 50, 162)
      .text(order.customer_company || '', 50, 176)
      .text(order.customer_email, 50, 190)
      .text(order.customer_phone, 50, 204);

    // ---- Tableau des articles ----
    let y = 240;
    doc
      .fontSize(9)
      .fillColor('white')
      .rect(50, y, 495, 24)
      .fill(NAVY);
    doc
      .fillColor('white')
      .text('Article', 60, y + 7)
      .text('Qté', 330, y + 7)
      .text('Prix unitaire', 380, y + 7)
      .text('Sous-total', 470, y + 7, { align: 'right', width: 65 });

    y += 24;
    doc.fillColor('#2E2E2E').fontSize(9);
    for (const item of order.items) {
      doc
        .text(item.product.name, 60, y + 8, { width: 260 })
        .text(String(item.quantity), 330, y + 8)
        .text(`${Number(item.unit_price).toFixed(2)} TND`, 380, y + 8)
        .text(`${Number(item.subtotal).toFixed(2)} TND`, 470, y + 8, {
          align: 'right',
          width: 65,
        });
      doc
        .moveTo(50, y + 26)
        .lineTo(545, y + 26)
        .strokeColor('#F0F0F0')
        .stroke();
      y += 26;
    }

    // ---- Total ----
    y += 20;
    doc
      .fontSize(12)
      .fillColor(NAVY)
      .text('Total TTC', 380, y, { continued: false })
      .fontSize(14)
      .text(`${Number(order.total_amount).toFixed(2)} TND`, 470, y, {
        align: 'right',
        width: 65,
      });

    doc
      .fontSize(8)
      .fillColor(GRAY)
      .text(
        'Merci pour votre confiance — iDeal Tech',
        50,
        750,
        { align: 'center', width: 495 },
      );

    doc.end();

    stream.on('finish', () => resolve(`/uploads/invoices/${fileName}`));
    stream.on('error', reject);
  });
}
