# Vibe Monorepo Template - Creation Process Log

This document serves as a historical record of the design decisions, architectural choices, and steps taken to build this full-stack monorepo template. It is designed to help future developers understand *why* the project is structured the way it is.

---

## Part 1: Design Decisions & Rationale

### 1. The Monorepo Choice
* **Decision**: Single repository containing `frontend`, `backend`, and `shared`.
* **Rationale**: For modern, fast-paced "vibe-coded" development, maintaining separate repositories adds unnecessary friction (multiple git origins, independent versioning, synchronizing type changes). A monorepo lets developers make atomic changes to frontend, backend, and types in a single commit.

### 2. Express on Bun (Backend)
* **Decision**: Express is used as the API framework, run inside the Bun runtime.
* **Rationale**: While Bun has ultra-fast native frameworks (like ElysiaJS), Express has the largest codebase ecosystem, the most mature documentation, and the highest level of competence among AI code generators. Running Express inside Bun gives us the best of both worlds: high compatibility/productivity and the performance speedups of the Bun JavaScript runtime.

### 3. Isolated TUI CLI Setup Wizard
* **Decision**: The CLI wizard resides in `cli/` with its own `package.json` and runs via Node.js + `tsx` (TypeScript Execute).
* **Rationale**: The CLI needs to run *before* the developer has installed Bun, Angular CLI, or other tools. By building it as an isolated project that runs on plain Node/NPM, the bootstrap process requires zero global pre-requisites other than Node. It can then verify and install other tools (like Bun and Angular CLI) on behalf of the developer.

### 4. Shared TS Contracts
* **Decision**: A simple folder `/shared` containing TypeScript files mapped in compiler settings via paths (`@shared/*`).
* **Rationale**: Many full-stack frameworks require publishing shared types to private registries or configuring complex package workspaces (npm/yarn/pnpm workspaces). Using simple compiler path mapping allows both IDE autocomplete and build engines to immediately pick up shared changes without running a build or publish step.

### 5. Drizzle ORM + SQLite (Default)
* **Decision**: Drizzle ORM configured with a local SQLite database file (`dev.db`) by default.
* **Rationale**: We wanted a database experience that works immediately after cloning without requiring Docker or a running Postgres instance. Drizzle ORM is lightweight and provides an identical query syntax for SQLite and Postgres, making it trivial for developers to shift to PostgreSQL when ready (documented in `DATABASE_SETUP.md`).

---

## Part 2: Step-by-Step Build Log

### Step 1: Initializing Workspace (2026-06-03)
* Created project layout and basic bootstrap documentation (`GETTING_STARTED.md`, `DATABASE_SETUP.md`, `CREATION_PROCESS.md`).
* Set up a unified root-level `.gitignore` file to clean workspace repository indexing.

### Step 2: Implementing Modules and Dev Scripts (2026-06-03)
* **CLI Customizer Tool**: Built a self-contained Node project in `/cli` using `@clack/prompts` and `tsx` (TypeScript Execute) to bootstrap configurations and audit tools. Added automated options to run backend/frontend dependency installation and Drizzle schema migrations (`db:push`) at the end of the wizard to ensure the database tables are fully ready out-of-the-box.
* **Shared TypeScript library**: Implemented data models and API response templates inside `/shared` mapped across projects.
* **Backend Express Server**: Implemented Drizzle ORM mappings, dynamic SQLite/Postgres selection, and production static hosting configurations inside `/backend`. Installed `bun-types` to support Bun globals in TypeScript.
* **Drizzle Migrations Configuration**: Added `backend/drizzle.config.ts` mapping schemas and added the `better-sqlite3` development dependency inside the backend project. Enabled dialect-specific migration runs in `package.json` (`db:push`/`db:push:pg` and `db:generate`/`db:generate:pg`) to ensure drizzle-kit can initialize tables out-of-the-box.
* **Frontend Angular SPA**: Generated a standalone Angular client, configured TS path-mappings, resolved TS `baseUrl` deprecations using `ignoreDeprecations: "6.0"`, and established development proxy forwarding configurations.
* **Orchestration**: Created PowerShell and Bash dev scripts (`serve-dev`, `serve-prod`) to simplify launching dev environments and production previews.
* **Orchestration Bugfix**: Resolved an issue where running scripts from the root directory caused the Angular CLI to fail (due to running outside of the workspace directory containing `angular.json`) and the SQLite database (`dev.db`) to generate in the monorepo root instead of the backend folder. Addressed by wrapping executions inside subshells/jobs that explicitly change directory (`cd`) to `frontend/` or `backend/` before launching.
