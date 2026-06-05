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

## Consuming APIs on the Frontend

To maintain separation of concerns and centralize API communication:
- **Do not** make HTTP requests (e.g., direct calls to `HttpClient`'s `get`, `post`, etc.) directly inside UI components.
- **Centralize calling logic**: Define all API integration logic as methods inside the central frontend/src/app/core/services/backend.service.ts.
- **Component Access**: Components should inject BackendService and call its methods to fetch or send data, ensuring consistent error handling and type safety.

## Middleware
- Use existing standard Express middleware (e.g., `cors`, `express.json()`). 
- When building new endpoints, always validate request bodies and parameters.
