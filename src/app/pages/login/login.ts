import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  isLogin = true;
  loginError="";
  registerError="";

  loginData = {
    username: '',
    password: ''
  };

  registerData: User = {
    username: '',
    name: '',
    surname: '',
    password: '',
    orders: [],
    cart: null
  };

  constructor(private router: Router) { }

  content={
    en: {
      login: 'Login',
      register: 'Register',
      username: 'Username',
      password: 'Password',
      name: 'Name',
      surname: 'Surname'
    },
    sr: {
      login: 'Prijava',
      register: 'Registracija',
      username: 'Korisničko ime',
      password: 'Lozinka',
      name: 'Ime',
      surname: 'Prezime'
    }
  }

  ngOnInit(){
    this.language = localStorage.getItem('language') || 'sr';
  }

  switchMode(mode: boolean) {
    this.registerError = '';
    this.loginError = '';
    this.isLogin = mode;
  }

  private language ='';

  register() {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    for (const user of registeredUsers) {
      if (user.username === this.registerData.username) {
        this.registerError = this.language == 'en' ? 'Username already exists' : 'Korisničko ime već postoji';
        return;
      }
    }
    if(!this.registerData.username || !this.registerData.password || !this.registerData.name || !this.registerData.surname) {
      this.registerError = this.language == 'en' ? 'All fields are required' : 'Sva polja su obavezna';
      return;
    }

    this.registerData.orders = [];
    this.registerData.cart = null;
    registeredUsers.push(this.registerData);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    alert('Registration successful!');
    this.isLogin = true;
  }

  login() {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if(!this.loginData.username || !this.loginData.password || registeredUsers.length === 0) {

      this.loginError =  this.language == 'en' ? 'WrongUsername or password' : 'Pogrešno korisničko ime ili lozinka';
      return;
    }
    for (const user of registeredUsers) {
      if (
        user.username === this.loginData.username &&
        user.password === this.loginData.password
      ) {
        this.loginError = '';
        localStorage.setItem('loggedUser', JSON.stringify(user));
        this.router.navigate(['/account']);
      } else {
        this.loginError =  this.language == 'en' ? 'Wrong username or password' : 'Pogrešno korisničko ime ili lozinka';
      }
    }



  }
  get t() {
    return this.content[this.language === 'en' ? 'en' : 'sr'];
  }
}