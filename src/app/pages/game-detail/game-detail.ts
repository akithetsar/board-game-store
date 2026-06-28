import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Game } from '../../services/game';
import { GameModel } from '../../models/games';
import { Catalog } from '../catalog/catalog';
import { Cart } from '../../models/Cart';
import { Lang, LanguageService } from '../../services/language-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './game-detail.html'
})
export class GameDetail implements OnInit {
  game?: GameModel;
  selectedImage = '';
  lang: Lang = inject(LanguageService).current;
  loggedUser = JSON.parse(localStorage.getItem('loggedUser') ?? 'null');

  private route = inject(ActivatedRoute);
  private gameService = inject(Game);

  userRating  = 0;
  hoverRating = 0;
  avgRating   = 0;
  ratingCount = 0;

  comments: { text: string; date: string; author : string  }[] = [];
  newComment = '';

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
      GameNotFound: 'Igra nije pronađena',
      ratingLabel: 'Ocenite igru',
      avgRating: 'Prosečna ocena',
      votes: 'glasova',
      yourVote: 'Vaša ocena',
      commentsLabel: 'Komentari',
      writeComment: 'Napišite komentar...',
      submitComment: 'Objavi',
      noComments: 'Još nema komentara.'
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
      price: 'Price',
      ratingLabel: 'Rate this game',
      avgRating: 'Average rating',
      votes: 'votes',
      yourVote: 'Your rating',
      commentsLabel: 'Comments',
      writeComment: 'Write a comment...',
      submitComment: 'Post',
      noComments: 'No comments yet.',
    }
  }

  ngOnInit(): void {
    const raw = localStorage.getItem('loggedUser');
    if (raw) this.loggedUser = JSON.parse(raw);
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    this.game = this.gameService
      .getGames()
      .find(g => g.id === id);


    this.loadRatings();
    this.loadComments();  
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

  loadRatings() {
    const data: Record<string, number> = JSON.parse(
      localStorage.getItem(`ratings_${this.game?.id}`) ?? '{}'
    );
    const votes = Object.values(data);
    this.ratingCount = votes.length;
    this.avgRating = votes.length
      ? +(votes.reduce((a, b) => a + b, 0) / votes.length).toFixed(1)
      : 0;
    // Restore this user's existing vote if they already rated
    if (this.loggedUser) {
      this.userRating = data[this.loggedUser.username] ?? 0;
    }
  }
  setRating(star: number) {
  if (!this.loggedUser) return;    const key = `ratings_${this.game?.id}`;
    const data: Record<string, number> = JSON.parse(localStorage.getItem(key) ?? '{}');
    data[this.loggedUser.username] = star;
    localStorage.setItem(key, JSON.stringify(data));
    this.userRating = star;
    this.loadRatings();
  }
  private loadComments() {
    this.comments = JSON.parse(
      localStorage.getItem(`comments_${this.game?.id}`) ?? '[]'
    );
  }

  submitComment() {
    if (!this.loggedUser || !this.newComment.trim()) return;
    const key = `comments_${this.game?.id}`;
    const list: { text: string; date: string; author : string }[] =
      JSON.parse(localStorage.getItem(key) ?? '[]');
    list.unshift({
      text: this.newComment.trim(),
      date: new Date().toLocaleDateString('sr-RS'),
      author: this.loggedUser.username
    });
    localStorage.setItem(key, JSON.stringify(list));
    this.comments = list;
    this.newComment = '';
  }
}