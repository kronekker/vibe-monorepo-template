# UI Styling Guidelines

This template uses a custom, lightweight CSS architecture based on standard Vanilla CSS and CSS Variables. **DO NOT use Tailwind CSS** or external utility libraries unless explicitly instructed.

## Core Principles

1. **Vanilla CSS & Variables**: All colors, typography, spacing, and shadows are defined as CSS custom properties (`var(--...)`) in `frontend/src/styles.css` inside the `:root` pseudo-class. 
2. **Theming**: Theming is handled via the `data-theme` attribute on the `<html>` or `<body>` element. New themes (e.g., `dark`, `oled`, `solar`, `cyberpunk`) override specific CSS variables.
3. **`vb-` Prefix**: All global utility and component classes are prefixed with `vb-` (short for Vibe) to prevent collisions.

## Utility Classes
Use the existing utility classes in `styles.css` for layout and spacing:
- **Flexbox**: `.vb-flex`, `.vb-flex-col`, `.vb-flex-center`, `.vb-flex-between`
- **Grid**: `.vb-grid`, `.vb-grid-cols-1`, `.vb-grid-cols-2`, `.vb-grid-cols-3`
- **Spacing**: `.vb-gap-2`, `.vb-gap-4`, `.vb-gap-6`, `.vb-mt-4`, `.vb-mb-4`

## Component Classes
Standard UI elements have pre-defined classes:
- **Buttons**: `.vb-btn`, `.vb-btn-primary`, `.vb-btn-secondary`.
- **Cards**: `.vb-card`, `.vb-card-hoverable`.
- **Forms**: `.vb-label`, `.vb-input`.
- **Alerts**: `.vb-alert`, with modifiers like `.vb-alert-info`, `.vb-alert-success`.
- **Spinners**: `.vb-spinner`, `.vb-spinner-sm`, `.vb-spinner-lg`.
- **Progress**: `.vb-progress` (container), `.vb-progress-bar` (inner track).

## Best Practices
- When creating a new component, check if it can be built using existing `.vb-` classes before writing custom CSS.
- If you must write custom CSS, prefer placing it in the component's encapsulated stylesheet or add generic, reusable classes to `styles.css` with the `vb-` prefix.
- Keep the design aesthetic modern: utilize the CSS variables for glassmorphism (`--shadow-glass`), smooth transitions (`--transition-fast`, `--transition-normal`), and rounded corners (`--radius-md`, `--radius-lg`).
