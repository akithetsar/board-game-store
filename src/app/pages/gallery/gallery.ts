import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Game } from '../../services/game';
import { GameModel } from '../../models/games';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.css'],
})
export class Gallery {
  private GameServis = inject(Game);
  videos = [
    'https://www.youtube.com/watch?v=HqVI1YX0wcQ',
    'https://www.youtube.com/watch?v=dvHqVyxdWYU',
    'https://www.youtube.com/watch?v=IHkRjn8XVtw',
    'https://www.youtube.com/watch?v=rBDWzpjFyjs'
  ];

  games:GameModel[] =[]

  images = [
    '/assets/images/store/store1.jpg',
    '/assets/images/store/store2.png',
  ];

  ngOnInit() {
    this.loadImagesfromGames();
  }

  loadImagesfromGames(){
    this.games = this.GameServis.getGames();
    for (const game of this.games) {
      for (const image of game.images) {
        this.images.push('/assets/images/games/' + image);
      }
    }
  }

  constructor(private sanitizer: DomSanitizer) {}

  embedUrl(watchUrl: string): SafeResourceUrl {
    try {
      const url = new URL(watchUrl);
      const id = url.searchParams.get('v') ?? watchUrl.split('/').pop() ?? '';
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}`);
    } catch {
      // fallback: try naive extraction
      const id = watchUrl.split('v=')[1]?.split('&')[0] ?? watchUrl;
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}`);
    }
  }
}