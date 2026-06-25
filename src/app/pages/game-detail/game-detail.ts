import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Game } from '../../services/game';
import { GameModel } from '../../models/games';
import { Catalog } from '../catalog/catalog';
import { Cart } from '../../models/Cart';
import { Lang, LanguageService } from '../../services/language-service';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './game-detail.html'
})
export class GameDetail implements OnInit {
  game?: GameModel;
  selectedImage = '';
  lang: Lang = inject(LanguageService).current;
  loggedUser = JSON.parse(localStorage.getItem('loggedUser') ?? 'null');

  private route = inject(ActivatedRoute);
  private gameService = inject(Game);


  content = {
    sr: {
      title: 'Prodavnica društvenih igara - Detalji igre',
      description: 'Opis igre',
      players: 'Igrača',
      age: 'Uzrast',
      duration: 'Trajanje',
      price: 'Cena',
      addToCart: 'Dodaj u korpu',
      back: 'Nazad na katalog',
      GameNotFound: 'Igra nije pronađena'
    },
    en: {
      title: 'Board Game Store - Game Details',
      back: 'Back to catalog',
      GameNotFound: 'Game not found',
      addToCart: 'Add to Cart',
      description: 'Description',
      players: 'Players',
      age: 'Age',
      duration: 'Duration',
      price: 'Price'
    }
  }

  ngOnInit(): void {
    const raw = localStorage.getItem('loggedUser');
    if (raw) this.loggedUser = JSON.parse(raw);
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    this.game = this.gameService
      .getGames()
      .find(g => g.id === id);

    if (this.game?.images.length) {
      this.selectedImage = this.game.images[0];
    }
    console.log(this.game?.images);
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  addToCart(): void {
    if (!this.loggedUser) {
      //alert(this.t.LoginRequired);
      return;
    }
    if (!this.loggedUser.cart) this.loggedUser.cart = new Cart();
    this.loggedUser.cart.items.push(this.game);

    // Persist to both localStorage keys
    const users = JSON.parse(localStorage.getItem('registeredUsers') ?? '[]');
    for (const u of users) {
      if (u.username === this.loggedUser.username) {
        u.cart = this.loggedUser.cart;
        break;
      }
    }

    localStorage.setItem('registeredUsers', JSON.stringify(users));
    localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));
  }

  get t() {
    return this.content[this.lang];
  }
}