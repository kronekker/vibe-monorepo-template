# Backend API Guidelines

The backend is built using **Express** running inside the **Bun** runtime. This provides a massive ecosystem of Express middleware along with the high performance and native TypeScript execution of Bun.

## Structure

- **Server Entrypoint (`index.ts`)**: `backend/src/index.ts` initializes the Express app and handles wildcard routing to serve the compiled frontend distribution files. **Do not define endpoints directly in `index.ts`.**
- **API Router (`api.ts`)**: The `/api` path is critical for hosting the entire stack in one place with proper separation between frontend and backend. All REST endpoints must be defined within the API router structure (starting in `backend/src/routes/api.ts`) so they are properly prefixed with `/api` and bypass the frontend static file hosting fallback.
- **Database**: Import the configured `db` client from `backend/src/db/index.ts`.

## Using Shared Types

One of the biggest advantages of this monorepo is the `shared/` directory.

- When defining an API response payload or a request body schema, define the TypeScript interface in the `shared/` folder (e.g., `shared/types.ts`).
- Import these types in both the backend and frontend using the mapped path `@shared/`:
  ```typescript
  import { UserDTO } from '@shared/types';
  ```

## Development Workflow

- The backend runs via `bun run dev` (configured in the `backend/package.json`). 
- Alternatively, use the root-level scripts (`serve-dev.sh` / `serve-dev.ps1`) to run both the backend and frontend concurrently.
- No compilation step is required for TypeScript files, as Bun executes `.ts` natively.

## Middleware
- Use standard Express middleware (e.g., `cors`, `express.json()`). 
- When building new endpoints, always validate request bodies and parameters.
