import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { __dirname } from '../helpers';
import { logger } from '../logger';
import { gameState } from '../gameEngine';

export const getImageHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (gameState.waitingImages.includes(id)) {
    logger.info(`Image with ID ${id} is still being processed.`);
    res.status(202).send('Image is still being processed');
    return;
  }

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
