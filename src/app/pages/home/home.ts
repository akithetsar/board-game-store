import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Game } from '../../services/game';
import { GameModel } from '../../models/games';

interface RatedGame extends GameModel {
  avgRating: number;
  ratingCount: number;
}

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html'
})
export class Home implements OnInit {
  private gameService = inject(Game);
  lang: 'sr' | 'en' = 'sr';

  top3: RatedGame[] = [];

  // Static deals — hardcode whichever game IDs + discount %
  deals = [
    { gameId: '2', discountPct: 20 },
    { gameId: '5', discountPct: 15 },
    { gameId: '8', discountPct: 10 },
  ];

  // Static tournament announcements
  tournaments = [
    { dateSr: '15. jul 2026.',        dateEn: 'July 15, 2026',       nameSr: 'Letnji Catan turnir',       nameEn: 'Summer Catan Tournament',    placeSr: 'ETF Beograd', placeEn: 'ETF Belgrade' },
    { dateSr: '3. avgust 2026.',       dateEn: 'August 3, 2026',      nameSr: 'Risk šampionat',            nameEn: 'Risk Championship',           placeSr: 'Novi Sad',    placeEn: 'Novi Sad'    },
    { dateSr: '20. septembar 2026.',   dateEn: 'September 20, 2026',  nameSr: 'Jesenji porodični turnir',  nameEn: 'Autumn Family Tournament',    placeSr: 'Beograd',     placeEn: 'Belgrade'    },
  ];

  // Static new arrivals — last 3 game IDs
  newGameIds = ['7', '8', '9'];

  content = {
    sr: {
      title:            'Prodavnica društvenih igara - Početna',
      heroTitle:        'Otkrijte, igrajte, pobedite!',
      heroSub:          'Vaša prodavnica društvenih igara u Beogradu',
      heroCta:          'Pogledajte katalog',
      dealsTitle:       'Trenutne ponude',
      off:              'popusta',
      oldPrice:         'Stara cena',
      tournamentsTitle: 'Najave turnira',
      where:            'Mesto',
      newTitle:         'Nove igre',
      topTitle:         'Top 3 ocenjene igre',
      votes:            'glasova',
      noRatings:        'Još nema ocenjenih igara — budite prvi!',
      details:          'Detalji',
      buyNow:           'Kupi odmah',
    },
    en: {
      title:            'Board Game Store - Home',
      heroTitle:        'Discover, Play, Win!',
      heroSub:          'Your board game store in Belgrade',
      heroCta:          'Browse catalog',
      dealsTitle:       'Current Deals',
      off:              'off',
      oldPrice:         'Old price',
      tournamentsTitle: 'Tournament Announcements',
      where:            'Location',
      newTitle:         'New Arrivals',
      topTitle:         'Top 3 Rated Games',
      votes:            'votes',
      noRatings:        'No rated games yet — be the first!',
      details:          'Details',
      buyNow:           'Buy Now',
    }
  };

  get t() { return this.content[this.lang]; }

  ngOnInit() {
    this.lang = (localStorage.getItem('lang') ?? 'sr') as 'sr' | 'en';
    this.loadTop3();
  }

  private loadTop3() {
    const rated: RatedGame[] = this.gameService.getGames().map(g => {
      const data: Record<string, number> = JSON.parse(
        localStorage.getItem(`ratings_${g.id}`) ?? '{}'
      );
      const votes = Object.values(data);
      return {
        ...g,
        avgRating:   votes.length ? +(votes.reduce((a, b) => a + b, 0) / votes.length).toFixed(1) : 0,
        ratingCount: votes.length
      };
    });

    this.top3 = rated
      .filter(g => g.ratingCount > 0)
      .sort((a, b) => b.avgRating - a.avgRating || b.ratingCount - a.ratingCount)
      .slice(0, 3);
  }

  get dealGames() {
    const all = this.gameService.getGames();
    return this.deals
      .map(d => ({ ...all.find(g => g.id === d.gameId)!, discountPct: d.discountPct }))
      .filter(g => g.id);
  }

  get newGames() {
    return this.gameService.getGames().filter(g => this.newGameIds.includes(g.id));
  }

  name(g: GameModel)  { return this.lang === 'en' ? g.name.en  ?? g.name.sr  : g.name.sr;  }
  group(g: GameModel) { return this.lang === 'en' ? g.group.en ?? g.group.sr : g.group.sr; }
  salePrice(price: number, pct: number) { return Math.round(price * (1 - pct / 100)); }
  stars(n: number)    { return [1,2,3,4,5].map(s => s <= Math.round(n) ? '★' : '☆').join(''); }
}