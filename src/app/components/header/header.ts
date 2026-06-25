import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LanguageService, Lang } from '../../services/language-service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  private langService = inject(LanguageService);

  // isto ime, isti tip kao pre - HTML ostaje neizmenjen
  get lang(): Lang {
    return this.langService.current;
  }

  cartCount = 0;
  isLoggedIn = false;
  username = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.refresh();
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.refresh());
  }

  refresh() {
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

  setLang(lang: Lang) {
    this.langService.setLang(lang);
    window.location.reload();
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.refresh();
    this.router.navigate(['/']);
  }
}