import express, { Request, Response } from 'express';
import cors from 'cors';
import { startGameHandler } from './handlers/startGameHandler';
import { promptHandler } from './handlers/promptHandler';
import { getStorylineHandler } from './handlers/getStorylineHandler';
import { getImageHandler } from './handlers/getImageHandler';
import { summarizeStoryHandler } from './handlers/summarizeStoryHandler';
import { resetGameHandler } from './handlers/resetGameHandler';
import { loadGameHandler } from './handlers/loadGameHandler';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: 'application/json' }));
app.use(express.json());

app.get('/api/isAlive', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is alive' });
});

app.post('/api/start', async (req: Request, res: Response) => {
  await startGameHandler(req, res);
});

app.get('/api/load', async (req: Request, res: Response) => {
  await loadGameHandler(req, res);
});

app.post('/api/reset', async (req: Request, res: Response) => {
  await resetGameHandler(req, res);
});

app.post('/api/prompt', async (req: Request, res: Response) => {
  await promptHandler(req, res);
});

app.get('/api/storyline', async (req: Request, res: Response) => {
  await getStorylineHandler(req, res);
});

app.get('/api/summarizeStory', async (req: Request, res: Response) => {
  await summarizeStoryHandler(req, res);
});

app.get('/api/images/:id', async (req: Request, res: Response) => {
  await getImageHandler(req, res);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
