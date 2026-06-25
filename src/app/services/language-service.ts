// language.service.ts
import { Injectable, signal } from '@angular/core';

export type Lang = 'sr' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private langSignal = signal<Lang>(
    (localStorage.getItem('lang') as Lang) ?? 'sr'
  );

  get current(): Lang {
    return this.langSignal();
  }

  setLang(lang: Lang) {
    this.langSignal.set(lang);
    localStorage.setItem('lang', lang);
  }
}