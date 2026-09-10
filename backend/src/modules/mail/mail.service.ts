import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Order } from '../order/entities/order.entity.js';
import { OrderType } from '../order/entities/order.entity.js';
import type { Product } from '../product/entities/product.entity.js';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  async sendOrderConfirmation(order: Order): Promise<void> {
    const isQuote = order.type === OrderType.QUOTE;
    const subject = isQuote
      ? `Demande de devis reçue — ${order.order_number}`
      : `Confirmation de commande — ${order.order_number}`;

    const itemsHtml = order.items?.length
      ? order.items
          .map(
            (item) =>
              `<tr>
                <td style="padding:6px 0;">${item.product.name} × ${item.quantity}</td>
                <td style="padding:6px 0; text-align:right;">${Number(item.subtotal).toFixed(2)} TND</td>
              </tr>`,
          )
          .join('')
      : '<tr><td>Détails à confirmer par notre équipe.</td></tr>';

    const trackingUrl = `${process.env.FRONTEND_URL}/suivi?orderNumber=${order.order_number}&email=${encodeURIComponent(order.customer_email)}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color:#1B3A57;">${isQuote ? 'Demande de devis reçue' : 'Commande confirmée'}</h2>
        <p>Bonjour ${order.customer_name},</p>
        <p>
          ${
            isQuote
              ? `Votre demande de devis <strong>${order.order_number}</strong> a bien été reçue. Notre équipe vous recontactera sous 24h.`
              : `Votre commande <strong>${order.order_number}</strong> a bien été enregistrée.`
          }
        </p>
        <table style="width:100%; border-collapse:collapse; margin:16px 0;">
          ${itemsHtml}
        </table>
        ${
          !isQuote
            ? `<p style="font-weight:bold; color:#1B3A57;">Total : ${Number(order.total_amount).toFixed(2)} TND</p>`
            : ''
        }
        <p style="margin:20px 0;">
          <a href="${trackingUrl}" style="background:#E0212B; color:white; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:bold;">
            Suivre ma ${isQuote ? 'demande' : 'commande'}
          </a>
        </p>
        <p style="color:#A6A6A6; font-size:12px;">iDeal Tech — contact@idealtech.tn</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"iDeal Tech" <${process.env.MAIL_USER}>`,
      to: order.customer_email,
      subject,
      html,
    });
  }

  // Notifie l'admin qu'une nouvelle commande/devis vient d'arriver
  async sendAdminNotification(order: Order): Promise<void> {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (!adminEmail) return;

    const isQuote = order.type === OrderType.QUOTE;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color:#1B3A57;">
          Nouvelle ${isQuote ? 'demande de devis' : 'commande'} : ${order.order_number}
        </h2>
        <p><strong>Client :</strong> ${order.customer_name} ${order.customer_company ? `(${order.customer_company})` : ''}</p>
        <p><strong>Email :</strong> ${order.customer_email}</p>
        <p><strong>Téléphone :</strong> ${order.customer_phone}</p>
        <p><strong>Total :</strong> ${Number(order.total_amount).toFixed(2)} TND</p>
        <p style="margin-top:16px;">
          <a href="${process.env.FRONTEND_URL}/admin/${isQuote ? 'devis' : 'commandes'}"
             style="color:#5FA8D3;">
            Voir dans l'admin →
          </a>
        </p>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"iDeal Tech — Notifications" <${process.env.MAIL_USER}>`,
      to: adminEmail,
      subject: `🔔 Nouvelle ${isQuote ? 'demande de devis' : 'commande'} — ${order.order_number}`,
      html,
    });
  }

  // Prévient un client qu'un produit qu'il attendait est de nouveau en stock
  async sendStockAlert(email: string, product: Product): Promise<void> {
    const productUrl = `${process.env.FRONTEND_URL}/produit/${product.id}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color:#1B3A57;">Bonne nouvelle !</h2>
        <p><strong>${product.name}</strong> est de nouveau disponible en stock.</p>
        <p style="margin:20px 0;">
          <a href="${productUrl}" style="background:#1B3A57; color:white; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:bold;">
            Voir le produit
          </a>
        </p>
        <p style="color:#A6A6A6; font-size:12px;">iDeal Tech — contact@idealtech.tn</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"iDeal Tech" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `${product.name} est de nouveau en stock`,
      html,
    });
  }

  async sendInvoiceEmail(
    to: string,
    invoiceNumber: string,
    pdfBuffer: Buffer,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"iDeal Tech" <${process.env.MAIL_USER}>`,
      to,
      subject: `Votre facture ${invoiceNumber}`,
      html: `<p>Veuillez trouver ci-joint votre facture <strong>${invoiceNumber}</strong>.</p>`,
      attachments: [{ filename: `${invoiceNumber}.pdf`, content: pdfBuffer }],
    });
  }
}
