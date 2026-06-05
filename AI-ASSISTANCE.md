# AI-Assisted Developer Guide: Mastering the "Skills" Architecture

Welcome! This repository is designed to be **AI-first**. By utilizing the `skills/` directory, you can guide coding agents (like Cursor, Antigravity, Windsurf, Cline, or GitHub Copilot) to write high-quality, architecturally-sound code that conforms exactly to this codebase's unique design system, file structures, and guidelines.

Without these skill files, LLMs will default to generic training data—often outputting Tailwind CSS utility classes, unnecessary npm dependencies, or legacy Angular patterns. By explicitly feeding these skill files to your AI agent, you enforce local patterns, ensure standalone Angular layouts, and guarantee consistent vanilla CSS variables.

---

## Table of Contents
1. [Overview of the Skills Directory](#1-overview-of-the-skills-directory)
2. [How to Feed Skills to Popular Coding Agents](#2-how-to-feed-skills-to-popular-coding-agents)
   - [Cursor (Composer & Chat)](#cursor-composer--chat)
   - [Windsurf (Cascade)](#windsurf-cascade)
   - [GitHub Copilot (VS Code)](#github-copilot-vs-code)
   - [Cline / Roo Code](#cline--roo-code)
   - [Claude Projects & ChatGPT Custom GPTs](#claude-projects--chatgpt-custom-gpts)
3. [The S-C-R-I-P-T Prompting Framework](#3-the-s-c-r-i-p-t-prompting-framework)
4. [Exhaustive Walkthrough Examples](#4-exhaustive-walkthrough-examples)
   - [Example A: Adding a New Feature (Analytics Dashboard)](#example-a-adding-a-new-feature-analytics-dashboard)
   - [Example B: Creating a Custom Theme ("Earthy Forest")](#example-b-creating-a-custom-theme-earthy-forest)
   - [Example C: Executing a Custom Python Data Script](#example-c-executing-a-custom-python-data-script)
5. [The Developer Loop: Writing Your Own Skills](#5-the-developer-loop-writing-your-own-skills)

---

## 1. Overview of the Skills Directory

The [skills/](file:///home/danielbellard/kronekker/my-new-app/skills) folder contains modular, markdown-based rule files. Each file addresses a specific area of the stack.

| Skill File | Description | Core Rule / Constraint |
| :--- | :--- | :--- |
| **[PROJECT-ARCHITECTURE.md](file:///home/danielbellard/kronekker/my-new-app/skills/PROJECT-ARCHITECTURE.md)** | Explains the monorepo design, `@shared/*` TypeScript path mappings, and scripts to run. | Use `./serve-dev.sh` to run the stack. Write shared structures in `/shared`. |
| **[UI-STYLING.md](file:///home/danielbellard/kronekker/my-new-app/skills/UI-STYLING.md)** | Outlines the custom lightweight CSS variables and utility classes. | **STRICTLY NO TAILWIND**. All utility and core classes must use the `.vb-` prefix. |
| **[CUSTOM-THEMES.md](file:///home/danielbellard/kronekker/my-new-app/skills/CUSTOM-THEMES.md)** | Guides the creation of custom theme attributes and mapping them in `ThemeService`. | Override variables in `styles.css` inside `[data-theme="name"]`, and update `theme.service.ts`. |
| **[NEW-UI-COMPONENTS.md](file:///home/danielbellard/kronekker/my-new-app/skills/NEW-UI-COMPONENTS.md)** | Standards for building Angular components. | **Must be standalone** (`standalone: true`). Shared components go in `core/components`, feature pages in `features/`. |
| **[DATABASE-USAGE.md](file:///home/danielbellard/kronekker/my-new-app/skills/DATABASE-USAGE.md)** | Guides on integrating database operations on the Express server. | Ensure DB models, seeders, and routes follow backend repository structure. |
| **[BACKEND-API-GUIDELINES.md](file:///home/danielbellard/kronekker/my-new-app/skills/BACKEND-API-GUIDELINES.md)** | Structure for Express router paths and responses. | Standardize routing rules, JSON serialization, and error code layouts. |
| **[PYTHON-INTEGRATION.md](file:///home/danielbellard/kronekker/my-new-app/skills/PYTHON-INTEGRATION.md)** | Safe execution of Python subprocesses inside backend handlers. | Use `execFile` or `spawn` to prevent command-injection vulnerabilities. |
| **[INITIAL-FLOW.md](file:///home/danielbellard/kronekker/my-new-app/skills/INITIAL-FLOW.md)** | Step-by-step branding, routing customization, and template cleanup guide. | Safely delete demo/suggested-flow components, update logos, and configure base routing. |


---

## 2. How to Feed Skills to Popular Coding Agents

To get the best results, you must explicitly inject these files into the context window of your AI agent. Here is exactly how to do it in the most popular coding tools:

### Cursor (Composer & Chat)
Cursor features a robust indexing system called `@-mentions`. 
- **Including individual files**: In the Chat or Composer panel (`Ctrl+I` / `Cmd+I`), type `@` followed by the filename:
  > `"Create a new component referencing @NEW-UI-COMPONENTS.md and style it using @UI-STYLING.md."`
- **Including the whole folder**: Mention the folder by typing `@skills` (select folders) so Cursor parses all guides:
  > `"Build a backend route using rules defined in @skills folder."`
- **Adding Reference Components**: If you want a visual reference, mention `@starter.html` or `@suggested-flow.html` so Cursor can copy the structural conventions.
- **Automating with `.cursorrules`**: You can create a `.cursorrules` file in the root of the project to tell Cursor to always load these guidelines:
  ```json
  {
    "instruction": "Before writing or modifying code, locate the relevant skill file in /skills (e.g. UI-STYLING.md, NEW-UI-COMPONENTS.md) and adhere to its principles strictly."
  }
  ```

### Windsurf (Cascade)
Windsurf's AI assistant, **Cascade**, is highly context-aware and respects directories when referenced.
- **Adding files**: Type `@` and search for the specific skill file (e.g., `@UI-STYLING.md`).
- **Adding folders**: Type `@skills` to load all guides into Cascade's workspace memory.
- **Rules File**: Add rule references in a `.windsurfrules` file in the project root to enforce architectural principles globally across all sessions.

### GitHub Copilot (VS Code)
GitHub Copilot relies on workspace context commands.
- **Using `#file`**: In the Copilot Chat panel, use the `#` symbol:
  > `"Write a new component styled with #file:skills/UI-STYLING.md. Model the layout after #file:frontend/src/app/features/starter/starter.html"`
- **Using `@workspace`**: You can use `@workspace` and direct Copilot to check the skills:
  > `"@workspace check the skills/ directory. Build a new custom theme according to skills/CUSTOM-THEMES.md."`
- **System Instructions**: Set up a custom instructions file at `.github/copilot-instructions.md` containing:
  ```markdown
  - Read guidelines inside the `/skills` folder before suggesting additions.
  - Reject any library-driven style setups; respect the `vb-` styling guide in `/skills/UI-STYLING.md`.
  ```

### Cline / Roo Code
Cline and Roo Code read local paths directly from your prompt and can browse directories using tool calls.
- **Referencing paths**: Explicitly mention the absolute or relative path in your prompt:
  > `"Read the files skills/NEW-UI-COMPONENTS.md and skills/UI-STYLING.md. Then, create a new profile-card component..."`
- **Using `.clinerules`**: Create a `.clinerules` file in the root directory. Cline will automatically read this file at the start of a conversation to establish system constraints.

### Claude Projects & ChatGPT Custom GPTs
If you are using web-based LLMs:
- **Claude Projects**: Create a project in Claude.ai, then upload all files inside the `/skills` folder as project knowledge documents. You can also upload `styles.css` and `starter.html` as visual references.
- **ChatGPT Custom GPTs**: Build a Custom GPT, and upload the `/skills` files to the "Knowledge" section.
- **Direct Copy-Paste**: For one-off web queries, copy the entire markdown content of the relevant skill file and paste it into the prompt under a `---` separator:
  ```text
  Please build an Express route for retrieving logs. Follow these instructions:
  ---
  <Paste BACKEND-API-GUIDELINES.md contents here>
  ---
  ```

---

## 3. The S-C-R-I-P-T Prompting Framework

When working with coding agents in this codebase, construct your prompt using the **S-C-R-I-P-T** framework. This guarantees the agent understands the role, source, goal, constraints, patterns, and tests.

* **S**ystem / Role: Define the agent's identity (e.g., Angular developer, Express developer).
* **C**ontext / Sources: Explicitly reference the skill files (`/skills/*`).
* **R**equirement / Goal: Clearly state what needs to be created or modified.
* **I**mplementation Constraints: Enforce negative limits (e.g., **"NO TAILWIND"**, **"Standalone only"**).
* **P**attern Reference: Reference existing files in the repo as a blueprint (e.g., `starter.html`, `theme.service.ts`).
* **T**est / Verification: Ask the agent to build the project, run verification scripts, or specify how it should be validated.

---

## 4. Exhaustive Walkthrough Examples

Below are three typical developer scenarios, illustrating the exact prompts you should feed to the AI agent.

### Example A: Adding a New Feature (Analytics Dashboard)
In this scenario, we want to create a brand-new Standalone Component that serves as an analytics page. It must render layout cards, use the backend API, and conform to the custom CSS styling.

#### 1. Prepare Context Files
You will need:
- `skills/NEW-UI-COMPONENTS.md` (for Angular Standalone architecture)
- `skills/UI-STYLING.md` (for layouts, cards, and `.vb-` prefixes)
- `frontend/src/app/features/starter/starter.html` (reference for styling and error handling)
- `frontend/src/app/app.routes.ts` (to register the new route)

#### 2. The Prompt to the Agent
> **System/Role**: You are a senior frontend Angular developer.
> **Context**: Read the guidelines in `skills/NEW-UI-COMPONENTS.md` and `skills/UI-STYLING.md`. Refer to `frontend/src/app/features/starter/starter.html` for how styles are applied.
> **Goal**: Create a new Standalone Component for an Analytics Dashboard at `frontend/src/app/features/analytics/analytics.component.ts` (with inline template/styles or separate HTML/CSS, matching project patterns).
> **Details**:
> - Create a 3-column statistics grid showing "Total Sales" ($12,450), "Active Users" (1,240), and "Conversion Rate" (2.4%). Use the `.vb-grid` and `.vb-grid-cols-3` classes.
> - Enclose each stat in a `.vb-card` with hover animations (`.vb-card-hoverable`).
> - Use standard custom colors: main text `var(--color-text-main)` and secondary text `var(--color-text-muted)`.
> **Constraints**: DO NOT import Tailwind. Do not use external charting libraries; represent the data values using basic styled flex columns/bars (`.vb-progress` and `.vb-progress-bar`).
> **Routing**: Register this new component under the path `/analytics` in `frontend/src/app/app.routes.ts`.

#### 3. Expected AI Agent Output
1. The AI creates `frontend/src/app/features/analytics/analytics.component.ts`:
   ```typescript
   import { Component } from '@angular/core';
   import { CommonModule } from '@angular/common';

   @Component({
     selector: 'app-analytics',
     standalone: true,
     imports: [CommonModule],
     templateUrl: './analytics.component.html',
     styleUrls: ['./analytics.component.css']
   })
   export class AnalyticsComponent {}
   ```
2. The AI creates `analytics.component.html` using the design tokens:
   ```html
   <div class="vb-container">
     <h1 class="vb-mb-4">Analytics Dashboard</h1>
     
     <div class="vb-grid vb-grid-cols-3 vb-gap-4 vb-mb-6">
       <!-- Card 1 -->
       <div class="vb-card vb-card-hoverable">
         <span style="font-size: var(--text-sm); color: var(--color-text-muted);">Total Sales</span>
         <div style="font-size: var(--text-xl); font-weight: bold; margin-top: var(--space-2);">$12,450</div>
       </div>
       <!-- Card 2 -->
       <div class="vb-card vb-card-hoverable">
         <span style="font-size: var(--text-sm); color: var(--color-text-muted);">Active Users</span>
         <div style="font-size: var(--text-xl); font-weight: bold; margin-top: var(--space-2);">1,240</div>
       </div>
       <!-- Card 3 -->
       <div class="vb-card vb-card-hoverable">
         <span style="font-size: var(--text-sm); color: var(--color-text-muted);">Conversion Rate</span>
         <div style="font-size: var(--text-xl); font-weight: bold; margin-top: var(--space-2);">2.4%</div>
       </div>
     </div>
   </div>
   ```
3. The AI registers the `/analytics` route in `app.routes.ts`.

---

### Example B: Creating a Custom Theme ("Earthy Forest")
In this scenario, we want to create a green forest-based CSS theme. It requires adding custom CSS selectors and registering the theme in the Angular service.

#### 1. Prepare Context Files
You will need:
- `skills/CUSTOM-THEMES.md` (the theming manual)
- `frontend/src/styles.css` (where variables live)
- `frontend/src/app/core/services/theme.service.ts` (where theme definitions are stored)

#### 2. The Prompt to the Agent
> **System/Role**: You are a senior frontend architect.
> **Context**: Read and follow `skills/CUSTOM-THEMES.md` and `skills/UI-STYLING.md`.
> **Goal**: Add a new theme called "Earthy Forest" (`forest`) to the application.
> **Implementation Details**:
> 1. In `frontend/src/styles.css`, define a new selector `[data-theme="forest"]`.
> 2. Set the following color variables (using HSL):
>    - Primary Color: forest green (`hsl(140, 50%, 35%)`)
>    - Background Color: light moss cream (`hsl(70, 20%, 96%)`)
>    - Surface Card Color: white-moss (`hsl(70, 15%, 98%)`)
>    - Border Color: muted leaf green (`hsl(140, 20%, 85%)`)
>    - Primary Text: dark evergreen (`hsl(140, 60%, 12%)`)
>    - Muted Text: forest shadow (`hsl(140, 20%, 40%)`)
> 3. Register the theme in `frontend/src/app/core/services/theme.service.ts`:
>    - Add the value `'forest'` to the `Theme` type.
>    - Append `{ value: 'forest', label: '🌲 Forest Mode' }` to the `themes` array.
> **Verification**: Verify that the theme compiles without syntax errors and matches the type interfaces.

#### 3. Expected AI Agent Output
1. The AI appends the CSS code block containing variable overrides to `frontend/src/styles.css`.
2. The AI opens `theme.service.ts`, updates the type union, and appends the dropdown menu registration object.
3. The AI confirms that files were written properly and are syntactically valid.

---

### Example C: Executing a Custom Python Data Script
In this scenario, a developer needs to calculate standard deviation on the backend using Python and show the result in the UI.

#### 1. Prepare Context Files
You will need:
- `skills/PYTHON-INTEGRATION.md`
- `skills/BACKEND-API-GUIDELINES.md`
- `backend/src/routes/api.ts`
- `frontend/src/app/features/starter/starter.ts`

#### 2. The Prompt to the Agent
> **System/Role**: You are a full-stack engineer.
> **Context**: Follow guidelines in `skills/PYTHON-INTEGRATION.md` and `skills/BACKEND-API-GUIDELINES.md`.
> **Goal**: Implement a flow to calculate standard deviation using a Python script.
> **Details**:
> 1. Create a Python script at `backend/src/scripts/stats.py`. It should take a list of numbers from command line arguments (e.g. `1 2 3 4 5`), calculate the standard deviation, and print the output.
> 2. Add a backend Express POST endpoint `/api/calculate-std-dev` in `backend/src/routes/api.ts`. This endpoint should parse an array of numbers from the request body, invoke `stats.py` using `execFile`, capture stdout, and return it in a JSON response: `{ success: true, stdDev: <value> }`.
> 3. Integrate standard error handling: if the python execution fails, return a `500` status with the error detail.
> **Constraints**: Strictly use `execFile` for security. Validate that the input is an array of numbers before spawning the process.

#### 3. Expected AI Agent Output
1. Python file `backend/src/scripts/stats.py`:
   ```python
   import sys
   import math

   def calculate_std_dev(numbers):
       n = len(numbers)
       if n <= 1:
           return 0.0
       mean = sum(numbers) / n
       variance = sum((x - mean) ** 2 for x in numbers) / (n - 1)
       return math.sqrt(variance)

   if __name__ == "__main__":
       try:
           numbers = [float(x) for x in sys.argv[1:]]
           print(calculate_std_dev(numbers))
       except Exception as e:
           print(f"Error: {str(e)}", file=sys.stderr)
           sys.exit(1)
   ```
2. Route registered inside `backend/src/routes/api.ts` using `execFile`:
   ```typescript
   import { execFile } from 'child_process';
   import * as path from 'path';

   router.post('/calculate-std-dev', (req, res) => {
     const { numbers } = req.body;
     
     if (!Array.isArray(numbers) || !numbers.every(num => typeof num === 'number')) {
       return res.status(400).json({ success: false, error: 'Invalid input. Must be an array of numbers.' });
     }

     const scriptPath = path.resolve(__dirname, '../scripts/stats.py');
     const stringArgs = numbers.map(String);

     execFile('python3', [scriptPath, ...stringArgs], (error, stdout, stderr) => {
       if (error) {
         return res.status(500).json({ success: false, error: stderr || error.message });
       }
       res.json({ success: true, stdDev: parseFloat(stdout.trim()) });
     });
   });
   ```

---

## 5. The Developer Loop: Writing Your Own Skills

As the application codebase scales, you will introduce new architectural standards (such as state management services, specific caching layers, or custom authorization guards). To keep AI agents aligned in future iterations, you should write new skills.

### How to Write a New Skill Guide
1. Create a markdown file inside the [skills/](file:///home/danielbellard/kronekker/my-new-app/skills) folder. Use uppercase snake-case names (e.g. `skills/GLOBAL-STATE.md`, `skills/AUTH-GUARDS.md`).
2. Adhere to the following structural template:

```markdown
# Skill Name / Architectural Rule

Briefly describe the purpose of this rule and why we follow it.

## How It Works
- Bulleted conceptual workflow.
- Dependencies or files involved.

## Directory Structure
- Core paths of files implementing this design.

## Code Blueprint
Provide a minimal, boilerplate code example that the AI can copy/paste:
\`\`\`typescript
// paste simple codebase boilerplate
\`\`\`

## Strict Constraints & Anti-Patterns
- Tell the AI what NOT to do (e.g., "Do not call local storage directly; use AuthStore").
```

3. Commit the new skill file to git. Now, you and other developers can instantly feed this file into Cursor, Windsurf, or Copilot to construct perfect components according to your newly established architecture.
