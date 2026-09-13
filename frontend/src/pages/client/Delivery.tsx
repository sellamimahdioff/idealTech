import { Link } from 'react-router-dom';

export function Delivery() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">
      <h1 className="text-2xl md:text-3xl font-bold text-[#1B3A57] mb-6 font-heading">
        Livraison
      </h1>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[#1B3A57] mb-2">
            Zones de livraison
          </h2>
          <p className="text-sm text-[#2E2E2E] leading-relaxed">
            Nous livrons dans tout le territoire tunisien, gouvernorat par
            gouvernorat. Le délai varie selon votre localisation et le mode de
            livraison choisi lors de la commande.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[#1B3A57] mb-2">
            Délais estimés
          </h2>
          <ul className="text-sm text-[#2E2E2E] space-y-1.5">
            <li>
              <strong>Grand Tunis</strong> — 24 à 48h ouvrées
            </li>
            <li>
              <strong>Autres régions</strong> — 48 à 72h ouvrées
            </li>
            <li>
              <strong>Commandes en gros / devis pro</strong> — délai
              communiqué avec le devis
            </li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[#1B3A57] mb-2">
            Suivi de commande
          </h2>
          <p className="text-sm text-[#2E2E2E] leading-relaxed mb-3">
            Un email de confirmation avec votre numéro de commande vous est
            envoyé dès validation. Vous pouvez suivre son statut à tout
            moment.
          </p>
          <Link
            to="/suivi"
            className="inline-block bg-[#1B3A57] text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          >
            Suivre ma commande
          </Link>
        </div>

        <div className="bg-[#EAF3FA] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[#1B3A57] mb-2">
            Une question sur une livraison en cours ?
          </h2>
          <p className="text-sm text-[#2E2E2E]">
            Contactez-nous par téléphone ou WhatsApp — nos coordonnées sont en
            bas de chaque page.
          </p>
        </div>
      </div>
    </div>
  );
}
