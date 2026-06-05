# Getting Started

Welcome to the Vibe Monorepo Template! This document provides a step-by-step guide on how to clone, bootstrap, configure, and launch your new project.

For a high-level overview of the technology stack and project structure, please refer to the [README.md](README.md).

---

## 📋 Prerequisites

To run the setup wizard and bootstrap your project, you will need:
1. **Node.js** (LTS version recommended)
2. **NPM** (comes pre-bundled with Node.js)

> [!NOTE]
> The customization wizard will automatically check for and guide you through installing other project requirements, such as **Bun** (required for the backend runtime) and **Angular CLI** (required for the frontend), during the setup phase.

---

## 🛠️ Bootstrapping the Project

Follow these steps to clone the template and customize it:

### 1. Clone the Template
Clone the repository into your preferred folder name and navigate into it:
```bash
# Clone this template
git clone https://github.com/kronekker/vibe-monorepo-template.git my-new-app

# Move into the folder
cd my-new-app
```

### 2. Configure Git Remotes (Optional)
If you want to start a fresh Git history or point to your own repository:
```bash
# Point origin to your own remote repository
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
```
*(Alternatively, the Setup Wizard in Step 4 can initialize a brand-new Git repository for you).*

### 3. Install CLI Dependencies
Navigate to the `cli` folder and install the required modules for the interactive wizard:
```bash
cd cli
npm install
```

### 4. Run the Customization CLI
Start the interactive setup wizard by running the start script:
```bash
npm start
```
This script runs the TypeScript-based wizard using `tsx` (TypeScript Execute) without requiring any global compilations.

### 5. Complete the Setup Wizard
The CLI will guide you through:
* **Dependency Auditing**: Verifying that `node`, `bun`, and `@angular/cli` are installed and up to date on your path (and will offer to install them if missing).
* **Project Metadata**: Configures your custom project name, description, and application subtitle.
* **Network Settings**: Configures custom dev ports for the frontend Angular app and backend Express server.
* **Git Initializer**: Offers to clean the template git history and initialize a fresh git repository.

### 6. Apply Database Schema
Before launching your development servers, ensure the database tables are initialized. If you did not choose to run database migrations automatically at the end of the Setup Wizard, navigate to the project root and run:
```bash
npm run db:push --prefix backend
```
*(This applies Drizzle configurations to your default local SQLite database file, creating the database and table structures).*

---

## 🚀 Running Development Servers

Once the wizard completes, return to the project root directory. You can launch both your frontend SPA and backend API server using the orchestrator scripts:

* **On Windows (PowerShell)**:
  ```powershell
  ./serve-dev.ps1
  ```
* **On macOS/Linux (Bash)**:
  Make the scripts executable:
  ```bash
  chmod +x serve-dev.sh serve-prod.sh
  ```
  Then launch the dev servers:
  ```bash
  ./serve-dev.sh
  ```

This command runs:
* **Frontend Angular SPA** on `http://localhost:<frontend_port>` (default: `http://localhost:4200`)
* **Backend Express Server** on `http://localhost:<backend_port>` (default: `http://localhost:3000`)

The frontend is pre-configured to proxy all API requests to the backend server automatically.

---

## 🏗️ Production Compilation & Deployment

To compile the Angular SPA statically and serve it under a single unified port from the Express backend, run the production preview scripts from the project root:

* **Windows (PowerShell)**:
  ```powershell
  ./serve-prod.ps1
  ```
* **macOS/Linux (Bash)**:
  ```bash
  ./serve-prod.sh
  ```

This script builds the frontend assets and automatically places them under the static folder serving logic inside the Express API, bypassing CORS policies in production.

---

## 🗄️ Database Customization

By default, the template runs on a local SQLite database file (`dev.db`). To switch your database provider to PostgreSQL (for Docker or cloud deployments), please see the detailed [DATABASE_SETUP.md](DATABASE_SETUP.md) guide.

---

## 📄 License
This project is licensed under the MIT License.
