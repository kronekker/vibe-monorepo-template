# Project Architecture & Monorepo Structure

This project uses a monorepo setup to minimize friction when making full-stack changes. 

## Directory Overview

- `/frontend`: The Angular Single Page Application (SPA).
- `/backend`: The Express server running on Bun.
- `/shared`: Shared TypeScript definitions (types, interfaces, constants) used by both frontend and backend.
- `/cli`: An isolated Node.js/CLI tool used to bootstrap the project. You rarely need to touch this during standard application development.

## Typescript Path Mapping

The magic of the monorepo relies on TypeScript path mapping rather than complex npm workspaces.
Both the `frontend/tsconfig.json` and `backend/tsconfig.json` contain a `paths` configuration mapping `@shared/*` to the `/shared/*` directory. This allows instant intellisense and cross-stack refactoring without build steps.

## Running the Application

Always use the provided orchestration scripts in the root directory to run the application:
- **Linux/Mac**: `./serve-dev.sh`
- **Windows**: `.\serve-dev.ps1`

These scripts automatically handle starting both the frontend Angular dev server and the backend Bun server in parallel, ensuring proper proxying.

## Philosophy
- **Speed & Vibe**: The goal is to build quickly. Avoid over-engineering. If a feature can be accomplished with a simple Express route, a shared type, and an Angular Standalone Component using Vanilla CSS, prefer that over adding new libraries or complex architectures.
