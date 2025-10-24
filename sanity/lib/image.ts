// sanity/lib/image.ts
import createImageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';

// Import the client configuration
import { client } from './client';

const imageBuilder = createImageUrlBuilder(client);

// Helper function to generate image URLs
export const urlForImage = (source: Image) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined; // Return undefined or a placeholder URL if needed
  }
  return imageBuilder?.image(source).auto('format').fit('max');
};