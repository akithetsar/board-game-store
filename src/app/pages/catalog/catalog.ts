import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { GameModel } from '../../models/games';
import { Game } from '../../services/game';
import { User } from '../../models/user';
import { Cart } from '../../models/Cart';

type Group = 'All' | 'Family' | 'Strategy' | 'Party';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.css'],
})
export class Catalog implements OnInit {
  loggedUser: User | null = null;
  games: GameModel[] = [];
  selectedGroup: Group = 'All';
  searchQuery = '';
  sortField: 'none' | 'name' | 'price' = 'none';
  sortDir: 'asc' | 'desc' = 'asc';
  lang: 'sr' | 'en' = 'sr';

  private gameService = inject(Game);
  private route       = inject(ActivatedRoute);

  // ── Labels ──────────────────────────────────────────
  labels = {
    sr: {
      All: 'Sve', Family: 'Porodične', Strategy: 'Strateške', Party: 'Zabavne',
      Details: 'Detalji', AddToCart: 'Dodaj u korpu', Games: 'igara',
      Catalog: 'Katalog igara', SortName: 'Naziv', SortPrice: 'Cena',
      Search: 'Pretraži igre...', LoginRequired: 'Morate biti prijavljeni da dodate u korpu.'
    },
    en: {
      All: 'All', Family: 'Family', Strategy: 'Strategy', Party: 'Party',
      Details: 'Details', AddToCart: 'Add to Cart', Games: 'games',
      Catalog: 'Game Catalog', SortName: 'Name', SortPrice: 'Price',
      Search: 'Search games...', LoginRequired: 'You must be logged in to add to cart.'
    }
  };

  categories: { key: Exclude<Group,'All'>; icon: string; sr: string; en: string }[] = [
    { key: 'Family',   icon: '👨‍👩‍👧', sr: 'Porodične igre', en: 'Family Games'   },
    { key: 'Strategy', icon: '♟️',      sr: 'Strateške igre', en: 'Strategy Games' },
    { key: 'Party',    icon: '🎉',      sr: 'Zabavne igre',   en: 'Party Games'    },
  ];

  get t() { return this.labels[this.lang]; }

  // ── Init ─────────────────────────────────────────────
  ngOnInit() {
    this.lang = (localStorage.getItem('lang') ?? 'sr') as 'sr' | 'en';
    this.games = this.gameService.getGames();

    const raw = localStorage.getItem('loggedUser');
    if (raw) this.loggedUser = JSON.parse(raw);

    // Pre-select group when navigating from the navbar dropdown
    this.route.queryParams.subscribe(params => {
      const g = params['group'] as Group;
      if (g && ['Family', 'Strategy', 'Party', 'All'].includes(g)) {
        this.selectedGroup = g;
      }
    });
  }

  // ── Helpers ──────────────────────────────────────────
  displayName(g: GameModel) { return this.lang === 'en' ? g.name.en ?? g.name.sr : g.name.sr; }
  displayGroup(g: GameModel){ return this.lang === 'en' ? g.group.en ?? g.group.sr : g.group.sr; }

  countFor(group: string): number {
    return this.games.filter(g => g.group.en === group).length;
  }

  setGroup(g: Group) { this.selectedGroup = g; }

  sortBy(field: 'name' | 'price') {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
    }
  }

  get displayedGames(): GameModel[] {
    let list = [...this.games];

    // Group filter
    if (this.selectedGroup !== 'All') {
      list = list.filter(g => g.group.en === this.selectedGroup);
    }

    // Search
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(g =>
        g.name.sr.toLowerCase().includes(q) ||
        (g.name.en ?? '').toLowerCase().includes(q)
      );
    }

    // Sort
    if (this.sortField === 'name') {
      list.sort((a, b) => {
        const cmp = this.displayName(a).localeCompare(this.displayName(b));
        return this.sortDir === 'asc' ? cmp : -cmp;
      });
    } else if (this.sortField === 'price') {
      list.sort((a, b) => this.sortDir === 'asc' ? a.price - b.price : b.price - a.price);
    }

    return list;
  }

  // ── Cart ─────────────────────────────────────────────
  addToCart(g: GameModel) {
    if (!this.loggedUser) {
      alert(this.t.LoginRequired);
      return;
    }
    if (!this.loggedUser.cart) this.loggedUser.cart = new Cart();
    this.loggedUser.cart.items.push(g);

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
}
