/** Collect ElevenLabs `textToSpeech.convert` stream into a single buffer. */
export async function readableStreamToBuffer(
  stream: ReadableStream<Uint8Array>,
): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Buffer[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    if (value?.byteLength) {
      chunks.push(Buffer.from(value));
    }
  }
  return Buffer.concat(chunks);
}
