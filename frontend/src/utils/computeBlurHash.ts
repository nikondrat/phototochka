import { blurHashFromFile } from "./blurHashFromFile";

/**
 * Сначала Web Worker (план media pipeline), при ошибке — основной поток.
 */
export async function computeBlurHash(file: File): Promise<string | undefined> {
  try {
    const hash = await new Promise<string>((resolve, reject) => {
      const worker = new Worker(
        new URL("../workers/image-processor.worker.ts", import.meta.url),
        { type: "module" }
      );
      worker.onmessage = (ev: MessageEvent<{ blurHash: string }>) => {
        worker.terminate();
        resolve(ev.data.blurHash);
      };
      worker.onerror = (err) => {
        worker.terminate();
        reject(err);
      };
      worker.postMessage({ file });
    });
    return hash || undefined;
  } catch {
    try {
      return await blurHashFromFile(file);
    } catch {
      return undefined;
    }
  }
}
