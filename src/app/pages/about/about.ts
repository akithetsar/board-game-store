import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  lang: string = localStorage.getItem('lang') || 'sr';
  ngOnInit() {
    //this.lang = 'en';
  }

  content = {
    sr: {
      partnersTitle: 'Korisni linkovi',
      title: 'O nama',
      historyTitle: 'Istorijat',
      history:
        'Naša prodavnica društvenih igara osnovana je sa ciljem da ljubiteljima igara pruži mesto gde mogu pronaći najkvalitetnije igre za sve uzraste.',

      descriptionTitle: 'Opis prodavnice i misija',
      description:
        'Nudimo širok izbor strateških, porodičnih i zabavnih društvenih igara. Naša misija je da povezujemo ljude kroz igru i podstičemo druženje.',

      awardsTitle: 'Nagrade i priznanja',
      awards:
        'Dobitnici smo priznanja za najbolju specijalizovanu prodavnicu društvenih igara i nagrade za vrhunsku korisničku podršku.',

      workingHoursTitle: 'Radno vreme',
      workingHours: 'Ponedeljak - Petak: 09:00 - 21:00 | Subota: 10:00 - 20:00',

      contactTitle: 'Kontakt',
      phone: 'Telefon: +381 11 6767 420',
      email: 'Email: info@boardgameshop.rs',

      addressTitle: 'Adresa',
      address: 'Bulevar kralja Aleksandra 73, Beograd',
    },

    en: {
      partnersTitle: 'Useful Links',
      title: 'About Us',
      historyTitle: 'History',
      history:
        'Our board game store was founded with the goal of providing game lovers with a place to find high-quality games for all ages.',

      descriptionTitle: 'Store Description and Mission',
      description:
        'We offer a wide range of strategy, family, and fun board games. Our mission is to connect people through gaming and encourage social interaction.',

      awardsTitle: 'Awards and Recognition',
      awards:
        'We are proud winners of awards for best specialty board game store and outstanding customer support.',

      workingHoursTitle: 'Working Hours',
      workingHours: 'Monday - Friday: 09:00 - 21:00 | Saturday: 10:00 - 20:00',

      contactTitle: 'Contact',
      phone: 'Phone: +381 11 6767 420',
      email: 'Email: info@boardgameshop.rs',

      addressTitle: 'Address',
      address: 'Bulevar kralja Aleksandra 73, Belgrade',
    },
  };

  get t() {
    return this.content[this.lang as 'sr' | 'en'];
  }

  changeLang(lang: string) {
    localStorage.setItem('lang', lang);
    this.lang = lang;
  }
}