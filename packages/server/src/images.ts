import { v4 as uuidv4 } from 'uuid';
import { imagegameInstructionPromptPrefix } from './defaults';
import { postImagePromptToLLM } from './llm';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { logger } from './logger';
import { __dirname } from './helpers';

import { gameState } from './gameEngine';

export const createAndStoreImage = (characterDescription: string) => {
  const imagePrompt = `${imagegameInstructionPromptPrefix}: ${characterDescription}`;
  const uuid = uuidv4();
  gameState.waitingImages.push(uuid);
  logger.info(`Creating image for ${uuid} with prompt: ${imagePrompt}`);
  postImagePromptToLLM(imagePrompt).then((response) => {
    const { data } = response;
    if (!Array.isArray(data)) {
      throw new Error('Invalid image data');
    }
    const imageData = data[0];
    const { url } = imageData;

    // Fetch the image and store it locally
    const imagePath = path.join(__dirname, '../', 'assets', `${uuid}.png`);
    const writer = fs.createWriteStream(imagePath);
    axios({
      url,
      method: 'GET',
      responseType: 'stream',
    }).then((imageResponse) => {
      imageResponse.data.pipe(writer);
      writer.on('finish', () => {
        logger.info(`Image saved to ${imagePath}`);
        gameState.waitingImages = gameState.waitingImages.filter((id) => id !== uuid);
      });
    });
  });
  return uuid;
};
