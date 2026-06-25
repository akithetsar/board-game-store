import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Gallery } from './pages/gallery/gallery';
import { Catalog } from './pages/catalog/catalog';
import { Account } from './pages/account/account';
import { About } from './pages/about/about';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'gallery', component: Gallery },
  { path: 'catalog', component: Catalog },
  { path: 'account', component: Account },
  { path: 'about', component: About },
  {path :'login', component: Login}
];