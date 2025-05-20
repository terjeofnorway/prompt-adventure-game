import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { ImagesResponse } from 'openai/resources';
import { buildImageStylePrompt } from './prompts';
import { generateImage } from './llm';
import { logger } from './logger';
import { __dirname } from './helpers';
import { removeImageFromQueue } from './gameState';
import { ImageContext } from './types';
import { GameTheme } from '@shared/types/GameState';
import { isValidGameTheme } from '@shared/helpers/typeValidators';

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
const createAndStoreImage = ({
  imagePrompt,
  uuid,
  context,
}: {
  imagePrompt: string;
  uuid: string;
  context: ImageContext;
}) => {
  logger.info(`Creating image for ${uuid} with prompt: ${imagePrompt}`);
  generateImage({ imagePrompt, context })
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
  logger.info(`Creating situation image for ${uuid} with prompt: ${imagePrompt}`);
  createAndStoreImage({ imagePrompt, uuid, context: 'situation' });
  return uuid;
};

/* Create a character portrait image based on the character description.
 */
export const createCharacterImage = (characterDescription: string, gameTheme: GameTheme) => {
  const portraitPrompt = `Portrait of a character: ${characterDescription}`;

  const imagePrompt = buildImageStylePrompt({
    gameTheme,
    description: portraitPrompt,
  });

  const uuid = uuidv4();
  logger.info(`Creating character portrait for ${uuid} with prompt: ${imagePrompt}`);
  createAndStoreImage({ imagePrompt, uuid, context: 'situation' });
  return uuid;
};

/* Create a background image to set the games overall theme.
 */
export const createBackgroundImage = (gameTheme: GameTheme) => {
  if (!isValidGameTheme(gameTheme)) {
    throw new Error(`Invalid game theme: ${gameTheme}`);
  }
  const descriptions: Record<GameTheme, string> = {
    pirate:
      'The setting is a moonlit pirate bay with wooden docks, glowing lanterns, and a stormy sky. In the foreground, a heroic pirate captain stands tall with a billowing coat, holding a cutlass high, as ghostly ships rise from the mist behind him. Lightning illuminates the scene, casting eerie shadows and revealing a hidden treasure chest glinting in the sand. 256-color palette with dithering, slightly pixelated look, exaggerated character proportions, and cinematic composition like a retro movie poster.',
    space:
      'A lone space hero stands on an alien cliffside under a vast galactic sky, gazing at a massive star cruiser engaged in a space battle above. Laser blasts streak across the stars, while distant planets and a glowing nebula paint the sky. The hero wears a retro space suit, one arm raised with a plasma tool, framed by the eerie glow of alien crystals. The image should resemble a classic sci-fi movie poster.',
    fantasy:
      'A young wizard stands atop a cliff at dawn, staff raised as magical energy swirls around them. Below lies a misty enchanted forest with glowing runes and a distant castle hovering in the air. Dragons soar in the sky, and a spellbook levitates beside the hero. The art style should use 256-color dithering, exaggerated proportions, and a rich, detailed pixel look with mystical lighting—like a classic fantasy movie poster in pixel form.',
  };

  const imagePrompt = buildImageStylePrompt({
    gameTheme,
    description: descriptions[gameTheme],
  });

  const uuid = uuidv4();
  createAndStoreImage({ imagePrompt, uuid, context: 'background' });
  return uuid;
};
