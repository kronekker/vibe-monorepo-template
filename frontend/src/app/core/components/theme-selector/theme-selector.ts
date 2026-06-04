import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  templateUrl: './theme-selector.html'
})
export class ThemeSelectorComponent {
  public readonly themeService = inject(ThemeService);

  onThemeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.themeService.setTheme(select.value as any);
  }
}
