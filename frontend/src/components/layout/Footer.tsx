export function Footer() {
  const whatsappNumber = '21651747882'; // remplace par le vrai numéro (format international, sans +)
  const phoneDisplay = '+216 51 747 882';

  return (
    <footer className="bg-[#1B3A57] text-[#B9C9D6] pt-10 md:pt-14 pb-6 px-4 md:px-6 mt-12 md:mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#E0212B]" />
            <span className="text-white font-extrabold text-lg font-heading">
              iDeal <em className="text-[#E0212B] not-italic">Tech</em>
            </span>
          </div>
          <p className="text-sm max-w-xs leading-relaxed">
            Grossiste et détaillant en matériel informatique. Le choix idéal
            pour vos équipements, particuliers comme professionnels.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Catalogue</h4>
          <ul className="space-y-2 text-sm">
            <li>Ordinateurs</li>
            <li>Composants</li>
            <li>Réseau</li>
            <li>Périphériques</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Entreprise</h4>
          <ul className="space-y-2 text-sm">
            <li>À propos</li>
            <li>Devis professionnels</li>
            <li>Livraison</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="break-words">
              <a href="mailto:contact@idealtech.tn" className="hover:text-white">
                contact@idealtech.tn
              </a>
            </li>
            <li>
              <a href={`tel:+${whatsappNumber}`} className="hover:text-white">
                {phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#25D366] font-semibold hover:underline"
              >
                💬 WhatsApp
              </a>
            </li>
            <li>Tunis, Tunisie</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 md:mt-10 pt-5 border-t border-white/10 text-xs flex flex-col md:flex-row gap-2 justify-between">
        <span>© {new Date().getFullYear()} iDeal Tech — Tous droits réservés</span>
        <span>Matricule fiscal : XXXXXXX</span>
      </div>
    </footer>
  );
}
