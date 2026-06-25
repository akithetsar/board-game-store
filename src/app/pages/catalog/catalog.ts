import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GameModel } from '../../models/games';
import { Game } from '../../services/game';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.css'],
})
export class Catalog {
  games: GameModel[] = [];
  selectedGroup: 'All' | 'Family' | 'Strategy' | 'Party' = 'All';
  private gameService = inject(Game);
  lang = 'sr';
   groupLabels = {
    sr: {
      Details: 'Detalji',
      AddToCart: 'Dodaj u korpu',
      All: 'Sve',
      Family: 'Porodične',
      Strategy: 'Strateške',
      Party: 'Zabavne',
    },
    en: {
      Details: 'Details',
      AddToCart: 'Add to Cart',
      All: 'All',
      Family: 'Family',
      Strategy: 'Strategy',
      Party: 'Party',
    },
  };



  ngOnInit() {
    this.games = this.gameService.getGames();
    this.lang = localStorage.getItem('lang') || 'sr';
    this.lang = 'en'
  }

  // helper to get localized name (default SR)
  displayName(g: GameModel) {
    return this.lang === 'en' ? g.name.en : g.name.sr;
  }

  displayGroup(g: GameModel) {
    return this.lang === 'en' ? g.group.en : g.group.sr;
  }

  groupLabel(group: 'All' | 'Family' | 'Strategy' | 'Party') {
    return this.groupLabels[this.lang === 'en' ? 'en' : 'sr'][group];
  }

  setGroup(g: 'All' | 'Family' | 'Strategy' | 'Party') {
    this.selectedGroup = g;
  }

  get displayedGames(): GameModel[] {
    if (this.selectedGroup === 'All') return this.games;
    return this.games.filter(x => x.group.en === this.selectedGroup);
  }

  get t(){
    return this.groupLabels[this.lang === 'en' ? 'en' : 'sr'];
  }
}