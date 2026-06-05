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

Get your development environment up and running in minutes. For detailed prerequisites, setup options, and database initialization instructions, see the full [Getting Started Guide](GETTING_STARTED.md).

1. **Clone the template & configure remotes**:
   ```bash
   git clone https://github.com/kronekker/vibe-monorepo-template.git my-new-app
   cd my-new-app
   # Option: git remote set-url origin <your-repo-url>
   ```

2. **Run the Setup Wizard** to configure ports and install dependencies:
   ```bash
   cd cli
   npm install
   npm start
   ```

3. **Initialize the Database** (SQLite by default):
   ```bash
   # Run from the root directory
   npm run db:push --prefix backend
   ```

4. **Launch the Development Servers**:
   * **Windows (PowerShell)**:
     ```powershell
     ./serve-dev.ps1
     ```
   * **macOS/Linux (Bash)**:
     ```bash
     chmod +x serve-dev.sh
     ./serve-dev.sh
     ```

Your template dashboard will open automatically on `http://localhost:4200` (or your configured port), proxying requests to the backend Express server.

---

## 🤖 AI Coding Agent Posture

This template is built from the ground up to be **AI-first**. Modern development is increasingly collaborative, partnering human intent with the rapid execution of AI coding agents (such as Cursor, Antigravity, Windsurf, and Copilot). However, this new paradigm introduces a unique challenge: **architectural entropy**. 

When multiple AI models, versions, and prompting styles touch a codebase over time, they inject their own biases and generic training data defaults. One model might write utility-first Tailwind CSS classes, while another introduces a complex CSS-in-JS library; one might use legacy Angular RxJS patterns, while another uses modern Signals. Without strict guardrails, codebases quickly devolve into a fragmented mosaic of conflicting patterns.

### The Value of an Opinionated Architecture
To counteract this, the Vibe Monorepo Template establishes an **opinionated architectural stack**. In software engineering, "opinions" are decisions made in advance to eliminate choice paralysis. 

Here is the philosophical truth: **the specific opinions chosen are less critical than the commitment to consistency itself.** 

Whether you prefer SQLite or PostgreSQL, Express or Elysia, vanilla CSS or preprocessors—having a predefined, uniform blueprint is what allows a codebase to remain clean, understandable, and maintainable. Consistency is the anchor that prevents architectural drift.

### How the Template is Designed for AI Alignment
By standardizing these patterns, we make the codebase highly amenable to AI coding agents in two major ways:

* **Leveraging LLM Competency ([CREATION_PROCESS.md](CREATION_PROCESS.md))**:
  As documented in the [Creation Process Log](CREATION_PROCESS.md), key design choices were selected to align with AI strengths. For example, we chose **Express** over more modern but obscure frameworks because Express possesses the largest training corpus in existence. AI models generate Express code with exceptionally high correctness and security. Similarly, utilizing simple TypeScript path-mappings (`@shared/*`) instead of complex monorepo workspaces removes toolchain friction that often confuses agents.

* **Modular Context Injection ([AI-ASSISTANCE.md](AI-ASSISTANCE.md) & [skills/](skills))**:
  Rather than relying on generic LLM behaviors, this template implements a dedicated [skills/](skills) directory. These modular markdown files act as architectural instruction sets for the AI. As detailed in the [AI-Assisted Developer Guide](AI-ASSISTANCE.md), developers can reference these files (using tools like Cursor `@-mentions` or Windsurf context anchors) to constrain the AI's outputs. This ensures that the generated code conforms exactly to local styling systems (like the `vb-` CSS classes outlined in [UI-STYLING.md](skills/UI-STYLING.md)) and standalone Angular architectures, preventing the introduction of redundant libraries or style variations.

By setting up these explicit boundaries, you allow AI agents to operate at peak efficiency—producing code that looks, feels, and performs as if it were written by a single, cohesive engineering team.

---

## 🏗️ Production Compilation & Deployment

To compile the Angular SPA statically and serve it under a single unified port from the Express backend, run the production preview scripts:

* **Windows**: `./serve-prod.ps1`
* **macOS/Linux**: `./serve-prod.sh`

This script builds the frontend assets and automatically places them under the static folder serving logic inside the Express API, bypassing CORS policies in production.

---

## 📄 License
This project is licensed under the MIT License.
