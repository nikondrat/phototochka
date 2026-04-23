import { encode } from "blurhash";

const MAX_SIDE = 32;

self.onmessage = async (e: MessageEvent<{ file: File }>) => {
  const { file } = e.data;
  const bitmap = await createImageBitmap(file);
  const w = Math.min(MAX_SIDE, bitmap.width);
  const h = Math.min(MAX_SIDE, bitmap.height);
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    self.postMessage({ blurHash: "" });
    return;
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  const { data, width, height } = ctx.getImageData(0, 0, w, h);
  const blurHash = encode(data, width, height, 4, 4);
  self.postMessage({ blurHash });
};

export {};
