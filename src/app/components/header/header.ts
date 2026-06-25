import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  lang: 'sr' | 'en' = 'sr';
  cartCount = 0;
  isLoggedIn = false;
  username = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Refresh on every navigation so cart badge stays in sync
    this.refresh();
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.refresh());
  }

  refresh() {
    this.lang = (localStorage.getItem('lang') ?? 'sr') as 'sr' | 'en';
    const raw = localStorage.getItem('loggedUser');
    if (raw) {
      const user = JSON.parse(raw);
      this.isLoggedIn = true;
      this.username = user.username ?? user.name ?? '';
      this.cartCount = user?.cart?.items?.length ?? 0;
    } else {
      this.isLoggedIn = false;
      this.username = '';
      this.cartCount = 0;
    }
  }

  setLang(lang: 'sr' | 'en') {
    this.lang = lang;
    localStorage.setItem('lang', lang);
    // Reload is the simplest way to re-render all translated text
    // in a uni project without a full translation service
    window.location.reload();
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.refresh();
    this.router.navigate(['/']);
  }
}
