export function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">
      <h1 className="text-2xl md:text-3xl font-bold text-[#1B3A57] mb-6 font-heading">
        À propos d'iDeal Tech
      </h1>

      <div className="prose max-w-none text-sm md:text-base text-[#2E2E2E] leading-relaxed space-y-5">
        <p>
          <strong>iDeal Tech</strong> est une société tunisienne spécialisée
          dans la vente de matériel informatique, en gros comme au détail.
          Nous accompagnons aussi bien les particuliers à la recherche du bon
          équipement que les entreprises qui ont besoin de solutions
          informatiques complètes et fiables.
        </p>

        <p>
          Notre catalogue couvre l'ensemble des besoins informatiques :
          ordinateurs portables et de bureau, composants, matériel réseau et
          sécurité, imprimantes et consommables, solutions de stockage, et
          périphériques.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-8">
          <div className="bg-[#EAF3FA] rounded-xl p-5">
            <div className="text-2xl font-extrabold text-[#1B3A57] font-heading mb-1">
              Gros & détail
            </div>
            <p className="text-xs text-[#2E2E2E]">
              Des tarifs adaptés que vous achetiez une unité ou en volume.
            </p>
          </div>
          <div className="bg-[#EAF3FA] rounded-xl p-5">
            <div className="text-2xl font-extrabold text-[#1B3A57] font-heading mb-1">
              Sans compte
            </div>
            <p className="text-xs text-[#2E2E2E]">
              Commandez ou demandez un devis sans créer de compte, simplement.
            </p>
          </div>
          <div className="bg-[#EAF3FA] rounded-xl p-5">
            <div className="text-2xl font-extrabold text-[#1B3A57] font-heading mb-1">
              Réactivité
            </div>
            <p className="text-xs text-[#2E2E2E]">
              Une équipe disponible par téléphone, WhatsApp ou email.
            </p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-[#1B3A57] font-heading mt-8 mb-3">
          Notre engagement
        </h2>
        <p>
          Nous sélectionnons des produits fiables auprès de marques reconnues,
          et nous nous engageons à répondre rapidement à toute demande de
          devis professionnel. Notre objectif : être le partenaire
          informatique idéal, aussi bien pour un particulier qui équipe son
          bureau à la maison que pour une entreprise qui lance un nouveau
          site.
        </p>
      </div>
    </div>
  );
}
