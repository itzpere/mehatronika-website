export interface MDFileInfo {
  filename: string
  title: string
  description: string
}

export const mdFileInfo: MDFileInfo[] = [
  {
    filename: 'Pregled.md',
    title: 'Pregled',
    description:
      'Osnovne informacije o predmetu koje pomažu studentima da brzo shvate šta očekivati.',
  },
  {
    filename: 'NastavniPlan.md',
    title: 'Nastavni Plan',
    description: 'Detaljan raspored aktivnosti i gradiva koje student mora da savlada.',
  },
  {
    filename: 'Materijali.md',
    title: 'Materijali',
    description: 'Svi resursi na jednom mestu – od snimaka do zadataka za vežbu.',
  },
  {
    filename: 'IskustvaSaveti.md',
    title: 'Iskustva i Saveti',
    description: 'Praksa proverena generacijama – šta stariji studenti žele da su znali.',
  },
]
