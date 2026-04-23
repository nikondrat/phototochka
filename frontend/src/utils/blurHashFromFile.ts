import { encode } from 'blurhash';

const MAX_SIDE = 32;

/**
 * BlurHash для плейсхолдера (клиент) до готовности media pipeline.
 */
export async function blurHashFromFile(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const w = Math.min(MAX_SIDE, bitmap.width);
  const h = Math.min(MAX_SIDE, bitmap.height);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D недоступен");
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  const { data, width, height } = ctx.getImageData(0, 0, w, h);
  return encode(data, width, height, 4, 4);
}
