import { Router, Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AppInfo, User, ApiResponse, CreateUserRequest, PythonRunRequest, PythonRunResponse } from '@shared/index';
import { execFile } from 'child_process';
import * as path from 'path';

const router = Router();

// GET /api/info
// Purpose: Retrieves application metadata, runtime version, and configured database type.
// Note: Demonstrates initial stack functionality by verifying environment and server config.
router.get('/info', (req: Request, res: Response) => {
  const info: AppInfo = {
    name: process.env.APP_NAME || 'Vibe Template',
    subtitle: process.env.APP_SUBTITLE || 'A vibe-coded fullstack monorepo application',
    version: '1.0.0',
    runtime: 'Bun ' + Bun.version,
    dbType: process.env.DB_TYPE || 'sqlite',
  };

  const response: ApiResponse<AppInfo> = {
    success: true,
    data: info,
  };
  res.json(response);
});

// GET /api/users
// Purpose: Fetches all registered users from the database.
// Note: Demonstrates initial stack functionality (database read connection and Drizzle ORM selection).
router.get('/users', async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(users);
    const response: ApiResponse<User[]> = {
      success: true,
      data: allUsers,
    };
    res.json(response);
  } catch (err: any) {
    const response: ApiResponse<never> = {
      success: false,
      error: err.message,
    };
    res.status(500).json(response);
  }
});

// POST /api/users
// Purpose: Creates a new user entry in the database.
// Note: Demonstrates initial stack functionality (database write operations, validation, and schema integration).
router.post('/users', async (req: Request, res: Response) => {
  const { name, email }: CreateUserRequest = req.body;

  if (!name || !email) {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Name and email are required fields.',
    };
    return res.status(400).json(response);
  }

  try {
    const result = await db.insert(users).values({ name, email }).returning();
    const createdUser = result[0];
    const response: ApiResponse<User> = {
      success: true,
      data: createdUser,
    };
    res.status(211).json(response);
  } catch (err: any) {
    const response: ApiResponse<never> = {
      success: false,
      error: err.message,
    };
    res.status(500).json(response);
  }
});

// DELETE /api/users/:id
// Purpose: Deletes an existing user by their ID.
// Note: Demonstrates initial stack functionality (ORM deletion queries and route parameter processing).
router.delete('/users/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Invalid user ID.',
    };
    return res.status(400).json(response);
  }

  try {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    if (result.length === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'User not found.',
      };
      return res.status(404).json(response);
    }
    const response: ApiResponse<any> = {
      success: true,
    };
    res.json(response);
  } catch (err: any) {
    const response: ApiResponse<never> = {
      success: false,
      error: err.message,
    };
    res.status(500).json(response);
  }
});

// POST /api/python-test
// Purpose: Triggers execution of a local Python script subprocess and returns its stdout.
// Note: Demonstrates initial stack functionality (multi-language execution and safe script invocation).
router.post('/python-test', (req: Request, res: Response) => {
  const { args }: PythonRunRequest = req.body;
  const scriptPath = path.resolve(__dirname, '../scripts/test.py');

  const processArgs = args || [];

  execFile('python3', [scriptPath, ...processArgs], (error, stdout, stderr) => {
    if (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: stderr || error.message || 'Failed to execute Python script',
      };
      return res.status(500).json(response);
    }
    
    const response: ApiResponse<PythonRunResponse> = {
      success: true,
      data: {
        output: stdout.trim(),
      },
    };
    res.json(response);
  });
});

export default router;
