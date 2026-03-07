import { generateGlowScore } from './scoreService.js';

/**
 * analyzeImages - take an array of image blobs or data and generate a result
 * returns object as produced by scoreService.generateGlowScore plus any
 * extra metadata (for now just timestamp, later maybe dimensions, etc.)
 */
export async function analyzeImages(images = []) {
  // simulate an asynchronous AI request
  await new Promise(res => setTimeout(res, 800));
  const inputs = { timestamp: Date.now(), count: images.length };
  return generateGlowScore(inputs);
}
