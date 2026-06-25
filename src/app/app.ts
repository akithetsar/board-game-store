import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Lang, LanguageService } from './services/language-service';
import { Breadcrumb } from "./components/breadcrumb/breadcrumb";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, Breadcrumb],
  templateUrl: './app.html'
})
export class App {

  lang: Lang
  private langService: LanguageService
  private titleService = inject(Title);

  constructor(langService: LanguageService) {
   
    this.langService = langService
    this.lang = this.langService.current
    
  }
  ngOnInit() {
    if (!localStorage.getItem('lang')) {
      this.langService.setLang('sr')
    }
    else { this.lang = this.langService.current }
  }
}