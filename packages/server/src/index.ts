import express, { Request, Response } from 'express';
import cors from 'cors';
import { postPromptHandler } from './handlers';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: 'application/json' }));
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the API' });
});

app.post('/api/prompt', async (req: Request, res: Response) => {
  await postPromptHandler(req, res);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
