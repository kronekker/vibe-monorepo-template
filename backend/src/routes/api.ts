import { Router, Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { AppInfo, User, ApiResponse, CreateUserRequest } from '@shared/index';

const router = Router();

// GET /api/info
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

export default router;
