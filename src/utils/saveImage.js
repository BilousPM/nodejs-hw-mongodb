import { saveFileToCloudinary } from './saveFileToCloudinary.js';
import { CLOUDINARY } from '../constants/index.js';
import { saveFileToUploadDir } from './saveFileToUploadDir.js';
import { env } from './env.js';

export const saveImage = async (file) => {
  if (env(CLOUDINARY.ENABLE_CLOUDINARY) === 'true') {
    return await saveFileToCloudinary(file);
  } else {
    return await saveFileToUploadDir(file);
  }
};
