import { Component, inject } from '@angular/core';
import { Lang, LanguageService } from '../../services/language-service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports:[],
  templateUrl: './footer.html'
})
export class Footer {

  lang: Lang = inject(LanguageService).current;

  content={
    sr: {
      store: 'Prodavnica društvenih igara',
      opis: 'Vaša prodavnica društvenih igara u Beogradu.',
      links: 'Brzi linkovi',
      contact: 'Kontakt',
      home: 'Početna',
      catalog: 'Katalog igara',
      gallery: 'Galerija',
      about: 'O nama',
      account: 'Moj nalog',
      workingDays: 'Ponedeljak - Petak: 09:00 - 21:00 | Subota: 10:00 - 20:00'

    },
    en: {
      store: 'Board Game Store',
      opis: 'Your board game store in Belgrade.',
      links: 'Quick Links',
      contact: 'Contact',
      home: 'Home',
      catalog: 'Game Catalog',
      gallery: 'Gallery',
      about: 'About Us',
      account: 'My Account',
      workingDays: 'Monday - Friday: 09:00 - 21:00 | Saturday: 10:00 - 20:00'
    }
  }

  get t(){
    return this.content[this.lang];
  }
}
