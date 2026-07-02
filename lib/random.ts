// crypto.getRandomValues-backed replacement for Math.random(), used for
// non-cryptographic UI randomness (shuffling flashcards, picking a demo
// backend Pod). Math.random() trips security scanners (Bearer) that flag
// any use of it regardless of context, so we route through the Web Crypto
// API instead even though nothing here is security-sensitive.
export function randomFloat(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 2 ** 32;
}

export function randomInt(maxExclusive: number): number {
  return Math.floor(randomFloat() * maxExclusive);
}
