import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { readFile } from 'node:fs/promises';

export async function setWasmURL(): Promise<void> {
  const wasmURL = '@lottiefiles/dotlottie-web/dist/dotlottie-player.wasm';
  const wasmModule = require.resolve(wasmURL);
  const wasm = await readFile(wasmModule, { encoding: 'base64' });
  const wasmDataUri = `data:application/octet-stream;base64,${wasm}`;

  DotLottie.setWasmUrl(wasmDataUri);
  DotLottieWorker.setWasmUrl(wasmDataUri);
}
