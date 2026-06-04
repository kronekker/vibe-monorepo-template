import { intro, outro, text, select, confirm, spinner, note } from '@clack/prompts';
import pc from 'picocolors';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const rootDir = path.resolve(__dirname, '..');

function isCommandAvailable(cmd: string): boolean {
  try {
    const isWin = process.platform === 'win32';
    const whereOrWhich = isWin ? 'where' : 'which';
    execSync(`${whereOrWhich} ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function getCommandVersion(cmd: string, args: string = '--version'): string {
  try {
    return execSync(`${cmd} ${args}`, { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

async function runDependencyCheck() {
  const s = spinner();
  s.start('Checking system dependencies...');

  const checks = {
    node: { available: isCommandAvailable('node'), version: '' },
    bun: { available: isCommandAvailable('bun'), version: '' },
    ng: { available: isCommandAvailable('ng'), version: '' },
  };

  if (checks.node.available) checks.node.version = getCommandVersion('node');
  if (checks.bun.available) checks.bun.version = getCommandVersion('bun');
  if (checks.ng.available) {
    try {
      // Angular CLI command might print more details, try clean check
      checks.ng.version = execSync('ng version', { encoding: 'utf8' })
        .split('\n')
        .find(line => line.includes('Angular CLI:'))
        ?.replace('Angular CLI:', '')
        .trim() || 'installed';
    } catch {
      checks.ng.version = 'installed';
    }
  }

  s.stop('Dependency checks completed.');

  return checks;
}

async function main() {
  console.clear();
  intro(pc.cyan('⚡ Vibe Monorepo Template Customization Wizard ⚡'));

  // 1. Dependency Audit
  const deps = await runDependencyCheck();

  // Print Summary
  const nodeStatus = deps.node.available ? pc.green(`Installed (${deps.node.version})`) : pc.red('Missing!');
  const bunStatus = deps.bun.available ? pc.green(`Installed (${deps.bun.version})`) : pc.red('Missing!');
  const ngStatus = deps.ng.available ? pc.green(`Installed (${deps.ng.version})`) : pc.red('Missing!');

  note(
    `Node.js:      ${nodeStatus}\n` +
    `Bun:          ${bunStatus}\n` +
    `Angular CLI:  ${ngStatus}`,
    'System Dependency Status'
  );

  // Install Bun if missing
  if (!deps.bun.available) {
    const installBun = await confirm({
      message: 'Bun runtime is missing. Would you like to install it now?',
      initialValue: true,
    });

    if (installBun) {
      const s = spinner();
      s.start('Installing Bun...');
      try {
        if (process.platform === 'win32') {
          execSync('powershell -Command "irm bun.sh/install.ps1 | iex"', { stdio: 'inherit' });
        } else {
          execSync('curl -fsSL https://bun.sh/install | bash', { stdio: 'inherit' });
        }
        s.stop('Bun installation completed successfully!');
        deps.bun.available = true;
      } catch (err) {
        s.stop('Bun installation failed.');
        console.error(pc.red('Failed to install Bun automatically. Please install it manually from https://bun.sh'));
      }
    }
  }

  // Install Angular CLI if missing
  if (!deps.ng.available) {
    const installNg = await confirm({
      message: 'Angular CLI (ng) is missing. Would you like to install it globally via NPM?',
      initialValue: true,
    });

    if (installNg) {
      const s = spinner();
      s.start('Installing Angular CLI globally...');
      try {
        execSync('npm install -g @angular/cli', { stdio: 'inherit' });
        s.stop('Angular CLI installed successfully!');
        deps.ng.available = true;
      } catch (err) {
        s.stop('Angular CLI installation failed.');
        console.error(pc.red('Failed to install Angular CLI. You may need Administrator/sudo rights. Run: npm install -g @angular/cli'));
      }
    }
  }

  // 2. Q&A Customization Settings
  const projectName = await text({
    message: 'What is your new Project Name?',
    placeholder: 'vibe-app',
    defaultValue: 'vibe-app',
    validate(value) {
      if (value.match(/[^a-zA-Z0-9-_]/)) return 'Name must contain only letters, numbers, hyphens, and underscores.';
    },
  });

  const projectSubtitle = await text({
    message: 'Provide an Application Subtitle:',
    placeholder: 'A vibe-coded fullstack monorepo application',
    defaultValue: 'A vibe-coded fullstack monorepo application',
  });

  const apiPort = await text({
    message: 'Backend Express Port number during Development:',
    placeholder: '3000',
    defaultValue: '3000',
    validate(value) {
      if (isNaN(Number(value))) return 'Port must be a valid number.';
    },
  });

  const frontendPort = await text({
    message: 'Frontend Angular Port number during Development:',
    placeholder: '4200',
    defaultValue: '4200',
    validate(value) {
      if (isNaN(Number(value))) return 'Port must be a valid number.';
    },
  });

  const dbChoice = await select({
    message: 'Configure your local database driver:',
    options: [
      { value: 'sqlite', label: 'SQLite (Single local file dev.db, zero dependencies)' },
      { value: 'postgres', label: 'PostgreSQL (External database server)' },
    ],
  });

  let postgresUrl = '';
  if (dbChoice === 'postgres') {
    postgresUrl = (await text({
      message: 'Enter PostgreSQL connection URI:',
      placeholder: 'postgres://postgres:postgres@localhost:5432/vibe_db',
      defaultValue: 'postgres://postgres:postgres@localhost:5432/vibe_db',
    })) as string;
  }

  const initGit = await confirm({
    message: 'Would you like to initialize a clean Git repository for this project?',
    initialValue: true,
  });

  const backendDir = path.join(rootDir, 'backend');
  const frontendDir = path.join(rootDir, 'frontend');

  // 3. Write Configs
  const s = spinner();
  s.start('Applying configuration settings to monorepo files...');

  try {
    // A. Update Root package.json
    const rootPkgPath = path.join(rootDir, 'package.json');
    if (fs.existsSync(rootPkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
      pkg.name = projectName;
      pkg.description = projectSubtitle;
      fs.writeFileSync(rootPkgPath, JSON.stringify(pkg, null, 2), 'utf8');
    }

    // B. Update Backend Environment/Config
    if (fs.existsSync(backendDir)) {
      // package.json name
      const bPkgPath = path.join(backendDir, 'package.json');
      if (fs.existsSync(bPkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(bPkgPath, 'utf8'));
        pkg.name = `${projectName}-backend`;
        fs.writeFileSync(bPkgPath, JSON.stringify(pkg, null, 2), 'utf8');
      }

      // Create .env file
      const envPath = path.join(backendDir, '.env');
      const envContent = 
        `PORT=${apiPort}\n` +
        `DB_TYPE=${dbChoice}\n` +
        `DATABASE_URL=${dbChoice === 'sqlite' ? 'dev.db' : postgresUrl}\n` +
        `APP_NAME="${projectName}"\n` +
        `APP_SUBTITLE="${projectSubtitle}"\n`;
      fs.writeFileSync(envPath, envContent, 'utf8');
    }

    // C. Update Frontend Angular Proxy/Config
    if (fs.existsSync(frontendDir)) {
      // package.json name
      const fPkgPath = path.join(frontendDir, 'package.json');
      if (fs.existsSync(fPkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(fPkgPath, 'utf8'));
        pkg.name = `${projectName}-frontend`;
        fs.writeFileSync(fPkgPath, JSON.stringify(pkg, null, 2), 'utf8');
      }

      // Update proxy.conf.json with new API port
      const proxyPath = path.join(frontendDir, 'proxy.conf.json');
      const proxyContent = {
        "/api": {
          "target": `http://localhost:${apiPort}`,
          "secure": false,
          "logLevel": "debug"
        }
      };
      fs.writeFileSync(proxyPath, JSON.stringify(proxyContent, null, 2), 'utf8');
    }

    // D. Update Orchestrator Port Scripts
    const serveDevPs1Path = path.join(rootDir, 'serve-dev.ps1');
    const serveDevShPath = path.join(rootDir, 'serve-dev.sh');

    if (fs.existsSync(serveDevPs1Path)) {
      let script = fs.readFileSync(serveDevPs1Path, 'utf8');
      script = script.replace(/FE_PORT = \d+/g, `FE_PORT = ${frontendPort}`);
      script = script.replace(/BE_PORT = \d+/g, `BE_PORT = ${apiPort}`);
      fs.writeFileSync(serveDevPs1Path, script, 'utf8');
    }

    if (fs.existsSync(serveDevShPath)) {
      let script = fs.readFileSync(serveDevShPath, 'utf8');
      script = script.replace(/FE_PORT=\d+/g, `FE_PORT=${frontendPort}`);
      script = script.replace(/BE_PORT=\d+/g, `BE_PORT=${apiPort}`);
      fs.writeFileSync(serveDevShPath, script, 'utf8');
    }

    s.stop('Configuration applied successfully!');
  } catch (err: any) {
    s.stop('Configuration mapping failed.');
    console.error(pc.red(`Error applying config: ${err.message}`));
  }

  // 4. Git Initialization (Optional)
  if (initGit) {
    const sGit = spinner();
    sGit.start('Resetting git repository...');
    try {
      execSync('git init', { cwd: rootDir, stdio: 'ignore' });
      try {
        execSync('git checkout -b main', { cwd: rootDir, stdio: 'ignore' });
      } catch {
        // Safe fail if branch exists or couldn't switch
      }
      sGit.stop('New Git repository initialized.');
    } catch {
      sGit.stop('Failed to initialize Git. Git may not be installed or in PATH.');
    }
  }

  // 4.5 Install Dependencies & Run Database Schema Push (Optional)
  const runInstall = await confirm({
    message: 'Would you like to install dependencies for backend & frontend projects now?',
    initialValue: true,
  });

  if (runInstall) {
    const sInst = spinner();
    // Always use npm install for setup. Drizzle Kit runs under Node and requires 
    // a standard Node module resolution structure, which Bun install on Windows can break.
    // Bun executes the backend server perfectly from NPM's node_modules.
    const backendPm = 'npm install';
    const frontendPm = 'npm install';
    
    sInst.start(`[Backend] Running "${backendPm}" in "${backendDir}"...`);
    try {
      execSync(backendPm, { cwd: backendDir, stdio: 'pipe', shell: true });
      
      sInst.message(`[Frontend] Running "${frontendPm}" in "${frontendDir}"...`);
      execSync(frontendPm, { cwd: frontendDir, stdio: 'pipe', shell: true });
      
      sInst.stop('All dependencies installed successfully!');

      // Offer to run migrations
      if (dbChoice === 'sqlite') {
        note(
          `SQLite database tables will be synchronized automatically when you start the backend server.`,
          'Database Initialization'
        );
      } else {
        const runMigrate = await confirm({
          message: 'Would you like to push the database schema to your PostgreSQL database now?',
          initialValue: true,
        });

        if (runMigrate) {
          const sMig = spinner();
          const runCmd = 'npm run db:push:pg';
          sMig.start(`[Database] Running "${runCmd}" in "${backendDir}"...`);
          try {
            execSync(runCmd, { cwd: backendDir, stdio: 'pipe', shell: true });
            sMig.stop('PostgreSQL database tables initialized successfully!');
          } catch (migErr: any) {
            sMig.stop('Database schema push failed.');
            const errMsg = migErr.stderr ? migErr.stderr.toString() : migErr.message;
            console.error(pc.yellow(`\nWarning: Schema push failed!\nCommand: ${runCmd}\nDirectory: ${backendDir}\nError output:\n${errMsg}\n`));
          }
        }
      }
    } catch (instErr: any) {
      sInst.stop('Dependency installation failed.');
      const errMsg = instErr.stderr ? instErr.stderr.toString() : instErr.message;
      console.error(pc.yellow(`\nWarning: Installation failed!\nCommand: [Dependency Installation]\nDirectory: ${backendDir} / ${frontendDir}\nError output:\n${errMsg}\n`));
    }
  }

  // 5. Final Outro
  outro(pc.cyan('🎉 Template customization completed! 🎉'));
  note(
    `1. Move back to root:  ${pc.yellow('cd ..')}\n` +
    `2. Run dev server:     ${pc.yellow(process.platform === 'win32' ? '.\\serve-dev.ps1' : './serve-dev.sh')}\n` +
    `3. Database Setup:     Read ${pc.yellow('DATABASE_SETUP.md')} for driver adjustments`,
    'Next Steps'
  );
}

main().catch(err => {
  console.error(pc.red(`Fatal Error in Customizer CLI: ${err.message}`));
  process.exit(1);
});
