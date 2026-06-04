import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'oled' | 'solar' | 'cyberpunk';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'vibe-theme';
  
  public readonly themes: { value: Theme; label: string }[] = [
    { value: 'light', label: '☀️ Light Mode' },
    { value: 'dark', label: '🌙 Dark Mode' },
    { value: 'oled', label: '⚫ OLED' },
    { value: 'solar', label: '🌅 Solar' },
    { value: 'cyberpunk', label: '🤖 Cyberpunk' },
  ];
  
  // Signal to hold the current theme
  public currentTheme = signal<Theme>('light');

  constructor() {
    this.initializeTheme();
    
    // Create an effect that runs whenever the signal changes
    // to update the DOM and localStorage
    effect(() => {
      const theme = this.currentTheme();
      if (theme === 'light') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
      }
      localStorage.setItem(this.THEME_KEY, theme);
    });
  }

  private initializeTheme(): void {
    const storedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    
    if (storedTheme && this.themes.some(t => t.value === storedTheme)) {
      this.currentTheme.set(storedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme.set(prefersDark ? 'dark' : 'light');
    }
  }

  public toggleTheme(): void {
    const currentIdx = this.themes.findIndex(t => t.value === this.currentTheme());
    const nextIdx = (currentIdx + 1) % this.themes.length;
    this.currentTheme.set(this.themes[nextIdx].value);
  }

  public setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }
}
