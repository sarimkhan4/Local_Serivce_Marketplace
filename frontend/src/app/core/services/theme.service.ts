import { Injectable } from '@angular/core';

const THEME_KEY = 'lsm-theme';

export type AppThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private mode: AppThemeMode = 'light';

  constructor() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    this.mode = this.readStoredMode();
    this.applyMode(this.mode);
  }

  currentMode(): AppThemeMode {
    return this.mode;
  }

  isDarkMode(): boolean {
    return this.mode === 'dark';
  }

  toggleMode(): AppThemeMode {
    this.mode = this.mode === 'dark' ? 'light' : 'dark';
    this.applyMode(this.mode);
    localStorage.setItem(THEME_KEY, this.mode);
    return this.mode;
  }

  private readStoredMode(): AppThemeMode {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'dark' ? 'dark' : 'light';
  }

  private applyMode(mode: AppThemeMode): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const body = document.body;

    if (mode === 'dark') {
      root.classList.add('my-app-dark');
      body.classList.add('my-app-dark');
      root.style.colorScheme = 'dark';
      body.style.colorScheme = 'dark';
    } else {
      root.classList.remove('my-app-dark');
      body.classList.remove('my-app-dark');
      root.style.colorScheme = 'light';
      body.style.colorScheme = 'light';
    }
  }
}
