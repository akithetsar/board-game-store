import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Game } from '../../services/game';
import { GameModel } from '../../models/games';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './game-detail.html'
})
export class GameDetail implements OnInit {
  game?: GameModel;
  selectedImage = '';

  private route = inject(ActivatedRoute);
  private gameService = inject(Game);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    this.game = this.gameService
      .getGames()
      .find(g => g.id === id);

    if (this.game?.images.length) {
      this.selectedImage = this.game.images[0];
    }
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  addToCart(): void {
    alert('Igra je dodata u korpu!');
  }
}