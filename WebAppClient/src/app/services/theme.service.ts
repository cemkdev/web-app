import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light'

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  readonly currentTheme = signal<Theme>('light');

  constructor() {
    this.setTheme(this.getThemeFromLocalStorage());
  }

  toggleTheme() {
    if (this.currentTheme() === 'light') {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
  }

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
    if (theme === 'dark') {
      this.document.documentElement.classList.add('dark');
    } else {
      this.document.documentElement.classList.remove('dark');
    }

    this.setThemeInLocalStorage(theme)
  }

  setThemeInLocalStorage(theme: Theme) {
    localStorage.setItem('preferred-theme', theme);
  }

  getThemeFromLocalStorage() {
    return localStorage.getItem('preferred-theme') as Theme ?? 'light';
  }
}
