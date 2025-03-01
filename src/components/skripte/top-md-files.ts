export interface MDFileInfo {
  filename: string
  title: string
  description: string
}

export const mdFileInfo: MDFileInfo[] = [
  {
    filename: 'opste_informacije.md',
    title: 'Opšte Informacije',
    description:
      'Osnovne informacije o predmetu - ESPB bodovi, nastavno osoblje, struktura bodovanja i ključni detalji.',
  },
  {
    filename: 'literatura.md',
    title: 'Literatura',
    description:
      'Obavezna i dopunska literatura sa linkovima ka resursima i lokacijama u biblioteci.',
  },
  {
    filename: 'priprema_za_ispit.md',
    title: 'Priprema za Ispit',
    description:
      'Arhiva prošlih ispita, rešeni zadaci, bonus materijali i korisni alati za vežbanje.',
  },
  {
    filename: 'iskustva_studenata.md',
    title: 'Iskustva Studenata',
    description: 'Saveti, strategije i upozorenja od studenata koji su već položili predmet.',
  },
]
