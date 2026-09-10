export interface Country {
  name: string;
  code: string;
  dialCode: string;
}

// Tunisie en premier (marché principal), puis Maghreb/France les plus courants
export const countries: Country[] = [
  { name: 'Tunisie', code: 'TN', dialCode: '+216' },
  { name: 'Algérie', code: 'DZ', dialCode: '+213' },
  { name: 'Maroc', code: 'MA', dialCode: '+212' },
  { name: 'Libye', code: 'LY', dialCode: '+218' },
  { name: 'France', code: 'FR', dialCode: '+33' },
  { name: 'Italie', code: 'IT', dialCode: '+39' },
  { name: 'Allemagne', code: 'DE', dialCode: '+49' },
  { name: 'Belgique', code: 'BE', dialCode: '+32' },
  { name: 'Canada', code: 'CA', dialCode: '+1' },
  { name: 'Émirats arabes unis', code: 'AE', dialCode: '+971' },
  { name: 'Arabie saoudite', code: 'SA', dialCode: '+966' },
  { name: 'Qatar', code: 'QA', dialCode: '+974' },
];

// Régions/gouvernorats de Tunisie (utilisés quand le pays sélectionné est la Tunisie)
export const tunisianRegions: string[] = [
  'Tunis',
  'Ariana',
  'Ben Arous',
  'Manouba',
  'Nabeul',
  'Zaghouan',
  'Bizerte',
  'Béja',
  'Jendouba',
  'Kef',
  'Siliana',
  'Sousse',
  'Monastir',
  'Mahdia',
  'Sfax',
  'Kairouan',
  'Kasserine',
  'Sidi Bouzid',
  'Gabès',
  'Médenine',
  'Tataouine',
  'Gafsa',
  'Tozeur',
  'Kébili',
];
