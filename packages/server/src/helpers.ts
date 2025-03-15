import { fileURLToPath } from 'url';
import path from 'path';

// Create __dirname equivalent for ES modules
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
