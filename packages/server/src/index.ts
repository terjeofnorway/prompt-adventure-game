import express, { Request, Response } from 'express';
import cors from 'cors';
import { startStoryHandler } from './handlers/startStoryHandler';
import { promptHandler } from './handlers/promptHandler';
import { getStorylineHandler } from './handlers/getStorylineHandler';
import { getImageHandler } from './handlers/getImageHandler';

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

app.get('/api/start', async (req: Request, res: Response) => {
  await startStoryHandler(req, res);
});

app.post('/api/prompt', async (req: Request, res: Response) => {
  await promptHandler(req, res);
});

app.get('/api/storyline', async (req: Request, res: Response) => {
  await getStorylineHandler(req, res);
});

app.get('/api/images/:id', async (req: Request, res: Response) => {
  await getImageHandler(req, res);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
