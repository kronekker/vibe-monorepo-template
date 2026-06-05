# Creating New UI Components

The frontend is built using **Angular** with a focus on modern, Standalone Components. 

## Component Guidelines

1. **Standalone by Default**: All new components should be standalone (`standalone: true` in the `@Component` decorator). We do not use `NgModules` for declaring components.
2. **Directory Structure**: 
   - Reusable, globally available components go in `frontend/src/app/core/components/` (e.g., Theme Selector).
   - Feature-specific components go in `frontend/src/app/features/<feature-name>/`.
3. **Styling**:
   - Rely heavily on the global `styles.css` classes (the `.vb-` prefix system). 
   - Use encapsulated component styles only when the styles are highly specific to that component and not reusable elsewhere.
4. **Naming Conventions**: Use `app-` prefix for component selectors (e.g., `<app-demo>`, `<app-theme-selector>`).

## Generating a Component

While you can write them manually, you can use the Angular CLI if you change directories into the `frontend/` folder:
```bash
cd frontend
npx ng generate component path/to/component --standalone
```

## State and Inputs/Outputs
- Use `@Input()` and `@Output()` for component communication.
- For global state, consider creating an Angular `@Injectable()` service in `frontend/src/app/core/services/` (e.g., `theme.service.ts`).
