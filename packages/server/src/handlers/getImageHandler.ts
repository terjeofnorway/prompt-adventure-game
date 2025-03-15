import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { __dirname } from '../helpers';
import { logger } from '../logger';

export const getImageHandler = (req: Request, res: Response) => {
  const { id } = req.params;
  const imagePath = `${path.join(__dirname, '../', 'assets')}/${id}.png`;

  logger.info(`Fetching image from path: ${imagePath}`);

  fs.stat(imagePath, (err, stats) => {
    if (err) {
      res.status(404).send('Image not found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': stats.size,
    });

    const readStream = fs.createReadStream(imagePath);
    readStream.pipe(res);
  });
};
