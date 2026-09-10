// PostgreSQL renvoie les colonnes decimal sous forme de string via le driver pg,
// même si TypeScript les type "number" côté entité. On sécurise ici une fois pour toutes.
export function formatPrice(value: number | string | null | undefined): string {
  const numValue = Number(value ?? 0);
  if (Number.isNaN(numValue)) return '0.00 TND';
  return (
    new Intl.NumberFormat('fr-TN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue) + ' TND'
  );
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
