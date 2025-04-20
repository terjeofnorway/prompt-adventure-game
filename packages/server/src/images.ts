import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { ImagesResponse } from 'openai/resources';
import { buildImageStylePrompt } from './prompts';
import { generateImage } from './llm';
import { logger } from './logger';
import { __dirname } from './helpers';
import { addImageToQueue, removeImageFromQueue } from './gameState';
import { ImageSize } from './types';
import { GameTheme } from '@shared/types/GameState';

type HandleImageResponseFromLLM = {
  response: ImagesResponse;
  uuid: string;
};

/* Handles the response from the LLM and saves the image locally.
 */
export const handleImageResponseFromLLM = ({ response, uuid }: HandleImageResponseFromLLM) => {
  const { data } = response;
  if (!Array.isArray(data)) {
    throw new Error('Invalid image data');
  }
  const imageData = data[0];
  const { url } = imageData;

  const imageStoragePath = path.join(__dirname, '../', 'assets', `${uuid}.png`);
  const writer = fs.createWriteStream(imageStoragePath);
  axios({
    url,
    method: 'GET',
    responseType: 'stream',
  }).then((imageResponse) => {
    imageResponse.data.pipe(writer);
    writer.on('finish', () => {
      logger.info(`Image saved to ${imageStoragePath}`);
      removeImageFromQueue(uuid);
    });
  });
};

/* Creates a image based on prompt description. Note that
 * this is not an async function, but it will create an image in the background and
 * just send the uuid to the client. The client will then poll the server to check
 * if the image is ready.
 */
const createAndStoreImage = ({ imagePrompt, uuid, size }: { imagePrompt: string; uuid: string; size: ImageSize }) => {
  logger.info(`Creating image for ${uuid} with prompt: ${imagePrompt}`);
  generateImage({ imagePrompt, size })
    .then((response) => handleImageResponseFromLLM({ response, uuid }))
    .catch((error) => {
      logger.error(`Error creating image for ${uuid}: ${error}`);
      removeImageFromQueue(uuid);
    });
};

/* Create a situation image to show visually what's happening in the game.
 */
export const createSituationImage = (description: string, gameTheme: GameTheme) => {
  const imagePrompt = buildImageStylePrompt({
    gameTheme,
    description,
  });

  const uuid = uuidv4();
  createAndStoreImage({ imagePrompt, uuid, size: 'medium' });
  return uuid;
};

/* Create a background image to set the games overall theme.
 */
export const createBackgroundImage = (gameTheme: GameTheme) => {
  const descriptions: Record<GameTheme, string> = {
    pirate:
      'A lively pirate harbor with ships, treasure maps, and pirates drinking grog. The scene is bustling with activity, with pirates trading goods and planning their next adventure. The sky is bright blue with fluffy clouds, and the sea is a deep turquoise.',
    space:
      'A futuristic spaceship flying through a galaxy filled with stars and planets. The ship is sleek and metallic, with glowing lights. The background is a colorful nebula with swirling gases and distant stars.',
    fantasy:
      'A medieval castle surrounded by enchanted forests and mythical creatures. The sky is blue with fluffy clouds. A small brook flows in the foreground with a small stone bridge crossing it.',
  };

  if (!descriptions[gameTheme]) {
    throw new Error(`Invalid game theme: ${gameTheme}`);
  }

  const imagePrompt = buildImageStylePrompt({
    gameTheme,
    description: descriptions[gameTheme],
  });

  const uuid = uuidv4();
  createAndStoreImage({ imagePrompt, uuid, size: 'xlarge' });
  return uuid;
};
