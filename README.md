# Vibe Monorepo Template

⚡ A high-performance, developer-first, full-stack monorepo template built for rapid prototyping and "vibe-coded" applications. ⚡

This project is a boilerplate template designed to be cloned and customized instantly using an interactive CLI setup wizard. It establishes key architectural decisions, type safety contracts, and orchestration scripts from day one.

---

## 🛠️ Technology Stack

* **Frontend**: **Angular SPA** (Standalone Components, Signals, modern control flow, and unstyled markup ready for custom UI systems).
* **Backend**: **Express API Server** running inside the high-performance **Bun runtime**.
* **Database / ORM**: **Drizzle ORM** with **SQLite** (`dev.db` file) pre-configured as the local development default, with support for **PostgreSQL** migration.
* **Shared Type Layer**: Unified TypeScript definitions folder imported directly by both frontend and backend projects using path mapping (`@shared/*`).
* **Customization CLI**: Self-contained interactive TUI wizard running via Node.js + `tsx` to customize metadata, port configurations, database choices, and bootstrap dependencies.

---

## 📂 Project Structure

```text
/
├── GETTING_STARTED.md        # Detailed bootstrapping and install instructions
├── DATABASE_SETUP.md         # Guide to switch from SQLite to Postgres (Docker/Cloud)
├── CREATION_PROCESS.md       # Chronological log of architecture and design decisions
├── serve-dev.ps1 / .sh       # Concurrent frontend & backend dev server runner
├── serve-prod.ps1 / .sh      # Production builder and static host preview script
│
├── cli/                      # Isolated Setup Wizard project
│   ├── index.ts              # Customization script (run with npm start inside /cli)
│   └── package.json
│
├── shared/                   # Shared type contracts & models
│   └── types/
│       └── api.ts            # Common API models & response envelopes
│
├── backend/                  # Bun + Express API Server project
│   ├── src/
│   │   ├── db/               # Drizzle database connector & tables schema
│   │   └── routes/           # Express router endpoints
│   └── package.json
│
└── frontend/                 # Angular SPA project
    ├── src/
    │   └── app/              # Sparse home page communicating with backend
    ├── angular.json
    ├── proxy.conf.json       # Dev CORS proxy settings
    └── package.json
```

---

## 🚀 Quick Start

1. **Clone the template and redirect origins**:
   ```bash
   # Clone this template into your custom directory name
   git clone https://github.com/kronekker/vibe-monorepo-template.git my-new-app
   
   # Move into the folder
   cd my-new-app
   
   # Point origin to your own remote repository
   git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   ```
2. **Navigate into the CLI folder** and install bootstrap dependencies:
   ```bash
   cd cli
   npm install
   ```
3. **Launch the Setup Wizard** to configure your project names, ports, and install dependencies:
   ```bash
   npm start
   ```
4. **Run the Development Servers** from the project root:
   * **Windows (PowerShell)**:
     ```powershell
     ./serve-dev.ps1
     ```
   * **macOS/Linux (Bash)**:
     ```bash
     chmod +x serve-dev.sh
     ./serve-dev.sh
     ```

Your unstyled template dashboard will open automatically on `http://localhost:4200` (or your configured port), communicating with the backend Express API server at `http://localhost:3000` via proxy.

---

## 🏗️ Production Compilation & Deployment

To compile the Angular SPA statically and serve it under a single unified port from the Express backend, run the production preview scripts:

* **Windows**: `./serve-prod.ps1`
* **macOS/Linux**: `./serve-prod.sh`

This script builds the frontend assets and automatically places them under the static folder serving logic inside the Express API, bypassing CORS policies in production.

---

## 📄 License
This project is licensed under the MIT License.
