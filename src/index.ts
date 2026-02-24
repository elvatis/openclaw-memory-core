export * from "./types.js";
export * from "./redaction.js";
export * from "./embedding.js";
export * from "./store-jsonl.js";

export function uuid(): string {
  // crypto.randomUUID is available in Node 18+
  // fallback just in case
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c: any = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `mem_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
