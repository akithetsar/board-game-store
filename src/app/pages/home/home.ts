import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.html'
})
export class Home {
  content = {
    sr: {
      title: 'Prodavnica društvenih igara - Početna',
    },
    en: {
      title: 'Board Game Store - Home',
    }
  }

  get t() {
    const lang = localStorage.getItem('lang') ?? 'sr';
    return this.content[lang as 'sr' | 'en'];
  }
}