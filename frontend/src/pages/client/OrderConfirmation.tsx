import { useParams, Link } from 'react-router-dom';

export function OrderConfirmation() {
  const { orderNumber } = useParams();

  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-6 text-2xl">
        ✓
      </div>
      <h1 className="text-2xl font-bold text-[#1B3A57] mb-3 font-heading">
        Commande confirmée
      </h1>
      <p className="text-sm text-[#2E2E2E] mb-6">
        Votre commande <strong>{orderNumber}</strong> a bien été enregistrée.
        Un email de confirmation vous a été envoyé. Conservez ce numéro pour
        suivre votre commande.
      </p>
      <div className="flex justify-center gap-3">
        <Link
          to={`/suivi?orderNumber=${orderNumber}`}
          className="border border-[#1B3A57] text-[#1B3A57] px-5 py-2.5 rounded-lg text-sm font-semibold"
        >
          Suivre ma commande
        </Link>
        <Link
          to="/catalogue"
          className="bg-[#1B3A57] text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
        >
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}
