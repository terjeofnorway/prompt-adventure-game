import { Request, Response } from 'express';

const imageWaiters = new Map<string, Response>();

export const eventSubscribeHandler = (req: Request, res: Response) => {
  const { id } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  imageWaiters.set(id, res);

  /*
  setTimeout(() => {
    notifyImageReady('abc123', '/images/generated/abc123.jpg');
  }, 5000);

  */

  req.on('close', () => {
    imageWaiters.delete(id);
  });
};

// Later...
// Call this function when the image is ready
export const notifyImageReady = (id: string) => {
  console.log(`Notifying image ready for ID: ${id}`);
  const res = imageWaiters.get(id);
  if (res) {
    res.write(`data: ${JSON.stringify({ id })}\n\n`);
    res.end(); // optional: close connection after sending
    imageWaiters.delete(id);
  }
};
