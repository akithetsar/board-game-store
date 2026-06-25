import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Gallery } from './pages/gallery/gallery';
import { Catalog } from './pages/catalog/catalog';
import { Account } from './pages/account/account';
import { About } from './pages/about/about';
import { Login } from './pages/login/login';
import { GameDetail } from './pages/game-detail/game-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'gallery', component: Gallery, data: { breadcrumb: { sr: 'Galerija', en: 'Gallery' } } },
  { path: 'catalog', component: Catalog, data: { breadcrumb: { sr: 'Katalog', en: 'Catalog' } } },
  { path: 'account', component: Account, data: { breadcrumb: { sr: 'Nalog', en: 'Account' } } },
  { path: 'about', component: About, data: { breadcrumb: { sr: 'O nama', en: 'About Us' } } },
  { path: 'login', component: Login, data: { breadcrumb: { sr: 'Prijava', en: 'Login' } } },
  { path: 'catalog/:id', component: GameDetail, data: { breadcrumb: { sr: 'Detalji igre', en: 'Game Details' } } },
];