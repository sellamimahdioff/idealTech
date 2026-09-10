import { useEffect, useState } from 'react';
import { invoiceService } from '../../../services/orderService.js';
import { formatPrice } from '../../../utils/formatPrice.js';

interface Invoice {
  id: number;
  invoice_number: string;
  total_amount: number | string;
  pdf_url: string;
  issued_at: string;
}

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    invoiceService.getAll().then(setInvoices).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B3A57] mb-8 font-heading">
        Factures
      </h1>

      {loading ? (
        <p className="text-sm text-[#A6A6A6]">Chargement...</p>
      ) : invoices.length === 0 ? (
        <p className="text-sm text-[#A6A6A6]">Aucune facture pour le moment.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-gray-50 text-left text-[#A6A6A6]">
              <tr>
                <th className="px-5 py-3 font-medium">N° facture</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Montant</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-gray-100">
                  <td className="px-5 py-3 font-medium text-[#2E2E2E]">
                    {inv.invoice_number}
                  </td>
                  <td className="px-5 py-3 text-[#A6A6A6]">
                    {new Date(inv.issued_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-5 py-3">{formatPrice(inv.total_amount)}</td>
                  <td className="px-5 py-3 text-right">
                    <a
                      href={`${import.meta.env.VITE_API_URL}${inv.pdf_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#5FA8D3] font-semibold"
                    >
                      Ouvrir / Imprimer
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
