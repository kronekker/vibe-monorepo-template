# Getting Started

Welcome to the Vibe Monorepo Template! This document explains how to bootstrap the template and customize it for your new project.

---

## Prerequisites

To launch the setup wizard, your computer only needs:
1. **Node.js** (LTS version recommended)
2. **NPM** (comes pre-bundled with Node.js)

The customization wizard will automatically check for and install all other project requirements (such as **Bun** and **Angular CLI**) during the setup phase.

---

## Bootstrapping the Project

Follow these steps to customize the template:

### 1. Install CLI Dependencies
Navigate to the `cli` folder and install the required modules for the TUI wizard:
```bash
cd cli
npm install
```

### 2. Run the Customization CLI
Start the interactive wizard by running the start script:
```bash
npm start
```
This script runs the TypeScript-based wizard using `tsx` (TypeScript Execute) without requiring any global compilations.

### 3. Complete the Setup Wizard
The CLI will guide you through:
* **Dependency Auditing**: Verifying that `node`, `bun`, and `@angular/cli` are installed and up to date on your path (and will offer to install them if missing).
* **Project Metadata**: Asking for your new project name and application subtitle.
* **Network Settings**: Setting up custom dev ports for the frontend Angular app and backend Express server.
* **Git Initializer**: Optionally cleaning the template git history and creating a new repository.

### 4. Apply Database Schema
Before launching your development servers, ensure the database tables are initialized. If you did not choose to run this automatically at the end of the Setup Wizard, navigate to the project root and run:
```bash
npm run db:push --prefix backend
```
*(This applies Drizzle configurations to your default SQLite database file, creating the `users` table).*

---

## Running Development Servers

Once the wizard completes, return to the root directory. You can launch both your frontend SPA and backend API server using the orchestrator scripts:

* **On Windows (PowerShell)**:
  ```powershell
  ./serve-dev.ps1
  ```
* **On macOS/Linux (Bash)**:
  ```bash
  chmod +x serve-dev.sh
  ./serve-dev.sh
  ```

This will run:
* **Frontend Angular SPA** on `http://localhost:<frontend_port>`
* **Backend Express Server** on `http://localhost:<backend_port>` (and proxy traffic automatically from the frontend)

For production build testing, use `./serve-prod.ps1` or `./serve-prod.sh`.
