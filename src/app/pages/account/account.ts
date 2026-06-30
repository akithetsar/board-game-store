import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { User } from '../../models/user';
import { Cart } from '../../models/Cart';
import { Order } from '../../models/Order';
import {  Lang, LanguageService } from '../../services/language-service';
import { GameModel } from '../../models/games';

@Component({
  selector: 'app-account',
  imports: [CommonModule],
  templateUrl: './account.html',
  styleUrls: ['./account.css'],
})
export class Account {

  loggedUser: User | null = null;
  cart: Cart = new Cart();
  orders: Order[] = [];
  private languageService = inject(LanguageService);

  private router = inject(Router);

  lang:Lang = this.languageService.current;

  content = {
    sr: {
      title: 'Prodavnica društvenih igara - Moj nalog',
      logout: 'Odjavi se',
      order: 'Porudžbina',
      buy: 'Kupi sada',
      hello: 'Zdravo',
      cart: 'Korpa',
      orders: 'Porudžbine',
      noItems: 'Nema stavki',
      account: 'Moj Nalog',
      remove: 'Ukloni'
    },
    en: {
      remove: 'Remove',
      logout: 'Logout',
      order: 'Order',
      buy: 'Buy Now',
      hello: 'Hello',
      cart: 'Cart',
      orders: 'Orders',
      noItems: 'No items yet',
      account: 'My Account',
      title: 'Board Game Store - My Account'
    }
  };

  ngOnInit() {
    this.lang = localStorage.getItem('lang') as Lang || 'sr';
    //this.lang = 'en';

    const userData = localStorage.getItem('loggedUser');

    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }

    this.loggedUser = JSON.parse(userData);

    this.cart = this.loggedUser?.cart ?? new Cart();
    console.log('Cart items:', this.cart.items);
    this.orders = this.loggedUser?.orders ?? [];
  }

  getQuantity(item: GameModel): number {
    return this.cart.items.filter((i) => i.id === item.id).length;
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/login']);
  }

  removeFromCart(item: any) {
    if (!this.loggedUser || !this.loggedUser.cart) {
      return;
    }
    const regisretedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    for (let i = 0; i < regisretedUsers.length; i++) {
      if (regisretedUsers[i].username === this.loggedUser.username) {
        for (let j = 0; j < regisretedUsers[i].cart.items.length; j++) {
          if (regisretedUsers[i].cart.items[j] === item) {            
            regisretedUsers[i].cart.items.splice(j, 1);
            break;
          }
        }
      }
    }
    for (let i = 0; i < this.loggedUser.cart.items.length; i++) {
      if (this.loggedUser.cart.items[i] === item) {
        this.loggedUser.cart.items.splice(i, 1);
        break;
      }
    }
    localStorage.setItem('registeredUsers', JSON.stringify(regisretedUsers));
    localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));
  }

  get t() {
    return this.content[this.lang === 'en' ? 'en' : 'sr'];
  }

  getCartTotal(): number {
    if (!this.loggedUser || !this.loggedUser.cart) {
      return 0;
    }
    let total = 0;
    for (const item of this.loggedUser.cart.items) {
      if (item.price === undefined) {
        console.warn(`Item with id ${item.id} has undefined price.`);
      }
      total += item.price;
    }
    return total;
  }

  checkout() {
    if (!this.loggedUser || !this.loggedUser.cart || this.loggedUser.cart.items.length === 0) {
      return;
    }
    const regisretedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    for (let i = 0; i < regisretedUsers.length; i++) {
      if (regisretedUsers[i].username === this.loggedUser.username) {
        regisretedUsers[i].orders.push({
          items: [...this.loggedUser.cart.items]
        });
        regisretedUsers[i].cart = new Cart();
        break;
      }
    }
    const porudzibna = new Order();
    porudzibna.items = [...this.loggedUser.cart.items];
    porudzibna.price = this.getCartTotal();
    this.loggedUser.orders.push(porudzibna);
    this.loggedUser.cart.items = [];
    localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));
    localStorage.setItem('registeredUsers', JSON.stringify(regisretedUsers));
  }

  getName(name: any): string {
    return name?.[this.lang] ?? name?.sr;
  }
}