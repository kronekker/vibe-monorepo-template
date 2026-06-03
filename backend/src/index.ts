import express from 'express';
import cors from 'cors';
import * as path from 'path';
import * as fs from 'fs';
import apiRouter from './routes/api';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Host Frontend static distribution files
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist/frontend/browser');

if (fs.existsSync(frontendDistPath)) {
  console.log(`Production build folder found. Serving static files from: ${frontendDistPath}`);
  
  // Serve static assets (js, css, images)
  app.use(express.static(frontendDistPath));

  // Wildcard fallback route to support Angular client-side routing
  app.get('*', (req, res, next) => {
    // If request starts with /api, pass it to api router (it will 404 or process)
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  console.log('Production build folder not found. API server is running in standalone mode.');
  app.get('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: 'Backend API is running, but Frontend production distribution files are missing. Run serve-dev or build the frontend.',
    });
  });
}

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
