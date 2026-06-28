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
  private route = inject(ActivatedRoute);

  // Content for localization
  content = {
    sr: {
      title: 'Prodavnica društvenih igara - Katalog',
      All: 'Sve', Family: 'Porodične', Strategy: 'Strateške', Party: 'Zabavne',
      Details: 'Detalji', AddToCart: 'Dodaj u korpu', Games: 'igara',
      Catalog: 'Katalog igara', SortName: 'Naziv', SortPrice: 'Cena',
      Search: 'Pretraži igre...', LoginRequired: 'Morate biti prijavljeni da dodate u korpu.'
    },
    en: {
      title: 'Board Game Store - Catalog',
      All: 'All', Family: 'Family', Strategy: 'Strategy', Party: 'Party',
      Details: 'Details', AddToCart: 'Add to Cart', Games: 'games',
      Catalog: 'Game Catalog', SortName: 'Name', SortPrice: 'Price',
      Search: 'Search games...', LoginRequired: 'You must be logged in to add to cart.'
    }
  };

  categories: { key: Exclude<Group, 'All'>; sr: string; en: string }[] = [
    { key: 'Family', sr: 'Porodične igre', en: 'Family Games' },
    { key: 'Strategy', sr: 'Strateške igre', en: 'Strategy Games' },
    { key: 'Party', sr: 'Zabavne igre', en: 'Party Games' },
  ];

  get t() { return this.content[this.lang]; }

  // Initialization
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

  // Helpers for displaying localized text
  displayName(g: GameModel) { return this.lang === 'en' ? g.name.en ?? g.name.sr : g.name.sr; }
  displayGroup(g: GameModel) { return this.lang === 'en' ? g.group.en ?? g.group.sr : g.group.sr; }

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

  // Cart management
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
  downloadPDF() {
    const lang = this.lang;
    const label = (sr: string, en: string) => lang === 'en' ? en : sr;

    const rows = this.games.map(g => `
      <tr>
        <td>${this.displayName(g)}</td>
        <td>${this.displayGroup(g)}</td>
        <td>${g.players}</td>
        <td>${g.age}</td>
        <td>${g.duration}</td>
        <td><strong>${g.price} RSD</strong></td>
      </tr>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
      <title>${label('Katalog igara', 'Game Catalog')}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #222; }
        h1   { text-align: center; margin-bottom: 4px; }
        p.sub{ text-align: center; color: #888; font-size: 12px; margin-bottom: 20px; }
        table{ width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 7px 10px; }
        th { background: #f3f4f6; font-weight: 600; }
        tr:nth-child(even) td { background: #fafafa; }
      </style></head><body>
      <h1>${label('Katalog igara', 'Game Catalog')}</h1>
      <p class="sub">Board Game Store &nbsp;|&nbsp; ${new Date().toLocaleDateString()}</p>
      <table>
        <thead><tr>
          <th>${label('Naziv','Name')}</th>
          <th>${label('Kategorija','Category')}</th>
          <th>${label('Igrači','Players')}</th>
          <th>${label('Uzrast','Age')}</th>
          <th>${label('Trajanje','Duration')}</th>
          <th>${label('Cena','Price')}</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <script>window.onload=()=>{window.print();window.onafterprint=()=>window.close();}</script>
      </body></html>`;

    const win = window.open('', '_blank');
    if (win) { win.document.write(html); win.document.close(); }
  }
}
