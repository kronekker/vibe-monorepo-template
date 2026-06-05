# Adding Custom Themes

This guide explains how to create your own custom themes and integrate them into the Vibe application. The theming system is built on Vanilla CSS variables and a centralized Angular `ThemeService`.

## 1. Define the Theme in CSS

All themes are defined in `frontend/src/styles.css` using the `[data-theme="<theme-name>"]` attribute selector. To create a new theme, you override the base CSS variables (colors, surfaces, text, borders) defined in the `:root` scope.

Here is an example of adding a new **"Forest"** theme:

```css
/* Add this to frontend/src/styles.css */
[data-theme="forest"] {
  /* Greenish primary color */
  --color-primary: hsl(135, 60%, 45%);
  --color-primary-hover: hsl(135, 60%, 40%);
  --color-primary-light: hsl(135, 60%, 90%);
  
  /* Earthy background and surface */
  --color-bg: hsl(120, 20%, 95%);
  --color-surface: hsl(120, 20%, 98%);
  
  /* Dark text for readability */
  --color-text-main: hsl(120, 30%, 20%);
  --color-text-muted: hsl(120, 20%, 45%);
  
  /* Subtle borders */
  --color-border: hsl(120, 30%, 85%);
}
```

## 2. Integrate with the ThemeService

Once your CSS is ready, you need to register the theme in the Angular application so it appears in the theme dropdown menu. 

Open `frontend/src/app/core/services/theme.service.ts` and make two changes:

1. **Add to the `Theme` type:** Update the exported `Theme` type to include your new theme identifier.
2. **Add to the `themes` array:** Add an object containing the `value` (matching your CSS data-theme) and a `label` (what the user sees in the dropdown).

```typescript
// frontend/src/app/core/services/theme.service.ts

// 1. Add 'forest' to the type definition
export type Theme = 'light' | 'dark' | 'oled' | 'solar' | 'cyberpunk' | 'forest';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // ...
  
  public readonly themes: { value: Theme; label: string }[] = [
    { value: 'light', label: '☀️ Light Mode' },
    { value: 'dark', label: '🌙 Dark Mode' },
    { value: 'oled', label: '⚫ OLED' },
    { value: 'solar', label: '🌅 Solar' },
    { value: 'cyberpunk', label: '🤖 Cyberpunk' },
    // 2. Add the forest theme to the available list
    { value: 'forest', label: '🌲 Forest' },
  ];

  // ...
}
```

## 3. Test Your Theme

Since the `ThemeService` binds directly to the UI, your new **Forest** theme will immediately show up in the application's theme dropdown menu. When selected, the `data-theme="forest"` attribute is applied to the HTML root element, automatically switching the CSS variables to your new values!
