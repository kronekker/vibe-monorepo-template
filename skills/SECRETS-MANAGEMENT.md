# Secrets Management

This boilerplate supports a flexible, "run-anywhere" environment configuration. It is designed to work seamlessly both on a bare workstation (using local `.env` files) and in enterprise Docker/Kubernetes container deployments (using mounted secret files/volumes).

## How It Works

To support uniform secret resolution, all application features and configurations retrieve secrets via a central utility instead of reading `process.env` directly.

The resolution priority works as follows:
1. **File-Mount Pointer (`_FILE`)**: The utility looks for an environment variable suffixed with `_FILE` (e.g., `DATABASE_URL_FILE`). If it exists and points to a valid file path, the secret is read directly from that file.
2. **Standard Environment Variable**: If no `_FILE` variable is defined or the referenced file is missing, the utility falls back to the standard environment variable (e.g., `DATABASE_URL`).
3. **Local/Default Fallback**: If neither is set, it falls back to a development default value where appropriate.

## Directory Structure

- **Secret Resolver Utility**: secrets.ts at backend/src/secrets.ts
- **Local Environment Config**: `.env` (derived from `.env.example` in the root or backend)

## Code Blueprint

### Resolving Secrets in Configuration Modules

Always centralize secret resolution into a configuration object. Avoid calling the secret resolver directly in your business logic:

```typescript
import { Secrets } from './secrets';

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  
  // Secrets resolved using the fallback pattern
  databaseUrl: Secrets.resolveSecret('DATABASE_URL') || 'postgresql://localhost:5432/dev_db',
  jwtSecret: Secrets.resolveSecret('JWT_SECRET') || 'local-dev-fallback-secret-key',
  apiKey: Secrets.resolveSecret('THIRD_PARTY_API_KEY'),
};
```

### Consuming Secrets in Business Logic

Import the configuration object directly, ensuring the business logic remains agnostic of how the secrets were loaded:

```typescript
import { config } from '../config';

async function connectToDatabase() {
  const dbUrl = config.databaseUrl;
  // Initialize database connection using dbUrl...
}
```

## Strict Constraints & Anti-Patterns

- **NO Direct `process.env` Reads for Secrets**: Never read `process.env.MY_SECRET` in application routes or controllers. Always go through the centralized config module or `Secrets.resolveSecret`.
- **NO Direct `fs.readFileSync` for Secrets**: Do not manually open or read mounted secret files in components or services. Let `Secrets.resolveSecret` handle it.
- **NO Hardcoded Production Secrets**: Never hardcode production credentials as default values or in checked-in configuration files.
- **Do Not Commit `.env` Files**: Always ensure local sensitive files are listed in `.gitignore` and only commit placeholder files like `.env.example`.
