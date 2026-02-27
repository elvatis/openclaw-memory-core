import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import type { Embedder, MemoryItem, MemoryKind, MemoryStore, SearchHit, SearchOpts } from "./types.js";
import { cosine } from "./embedding.js";

const VALID_KINDS = new Set<string>(["fact", "decision", "doc", "note"]);

type RecordLine = {
  item: MemoryItem;
  embedding?: number[];
};

/** Loose guard: ensure required MemoryItem fields are present, types are correct, and kind is valid. */
function isValidMemoryItem(x: unknown): x is MemoryItem {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o["id"] === "string" &&
    typeof o["kind"] === "string" &&
    VALID_KINDS.has(o["kind"]) &&
    typeof o["text"] === "string" &&
    typeof o["createdAt"] === "string"
  );
}

function matchesFilter(item: MemoryItem, kind?: MemoryKind, tags?: string[]): boolean {
  if (kind && item.kind !== kind) return false;
  if (tags && tags.length > 0) {
    const itemTags = item.tags ?? [];
    if (!tags.every((t) => itemTags.includes(t))) return false;
  }
  return true;
}

export class JsonlMemoryStore implements MemoryStore {
  private filePath: string;
  private embedder: Embedder;
  private maxItems: number;
  /** Serialises all write operations to prevent concurrent read-modify-write races. */
  private _writeLock: Promise<void> = Promise.resolve();
  /** In-memory cache; null means not yet loaded. Invalidated on every write. */
  private _cache: RecordLine[] | null = null;

  constructor(opts: { filePath: string; embedder: Embedder; maxItems?: number }) {
    this.filePath = opts.filePath;
    this.embedder = opts.embedder;
    this.maxItems = opts.maxItems ?? 5000;
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    if (!fs.existsSync(this.filePath)) fs.writeFileSync(this.filePath, "", "utf-8");
  }

  async add(item: MemoryItem): Promise<void> {
    if (!VALID_KINDS.has(item.kind)) {
      throw new TypeError(`[JsonlMemoryStore] Invalid kind "${item.kind}". Expected one of: ${[...VALID_KINDS].join(", ")}`);
    }
    return this._enqueue(async () => {
      const embedding = await this.embedder.embed(item.text);
      const line: RecordLine = { item, embedding };
      const records = await this._readAll();
      records.push(line);
      const trimmed = records.length > this.maxItems ? records.slice(records.length - this.maxItems) : records;
      await this._writeAll(trimmed);
    });
  }

  async get(id: string): Promise<MemoryItem | undefined> {
    const records = await this._readAll();
    return records.find((r) => r.item.id === id)?.item;
  }

  async delete(id: string): Promise<boolean> {
    return this._enqueue(async () => {
      const records = await this._readAll();
      const filtered = records.filter((r) => r.item.id !== id);
      if (filtered.length === records.length) return false;
      await this._writeAll(filtered);
      return true;
    });
  }

  async list(opts?: { limit?: number; kind?: MemoryKind; tags?: string[] }): Promise<MemoryItem[]> {
    const records = await this._readAll();
    const kindFilter = opts?.kind;
    const tagsFilter = opts?.tags;
    const filtered = (kindFilter !== undefined || (tagsFilter?.length ?? 0) > 0)
      ? records.filter((r) => matchesFilter(r.item, kindFilter, tagsFilter))
      : records;
    const lim = opts?.limit ? Math.max(1, opts.limit) : filtered.length;
    return filtered.slice(-lim).map((r) => r.item);
  }

  async search(query: string, opts?: SearchOpts): Promise<SearchHit[]> {
    const q = await this.embedder.embed(query);
    const records = await this._readAll();
    const hits: SearchHit[] = [];

    for (const r of records) {
      if (!r.embedding) continue;
      if (!matchesFilter(r.item, opts?.kind, opts?.tags)) continue;
      hits.push({ item: r.item, score: clamp01((cosine(q, r.embedding) + 1) / 2) });
    }

    hits.sort((a, b) => b.score - a.score);
    const limit = Math.max(1, Math.trunc(opts?.limit ?? 10));
    return hits.slice(0, limit);
  }

  /** Queue a write-side operation so concurrent callers never interleave. */
  private _enqueue<T>(fn: () => Promise<T>): Promise<T> {
    const next = this._writeLock.then(fn, fn) as Promise<T>;
    this._writeLock = (next as Promise<unknown>).then(() => {}, () => {});
    return next;
  }

  /** Read and parse all valid records from the JSONL file, with in-memory caching. */
  private async _readAll(): Promise<RecordLine[]> {
    if (this._cache !== null) return this._cache;
    try {
      const raw = await fsPromises.readFile(this.filePath, "utf-8");
      const out: RecordLine[] = [];
      for (const ln of raw.split("\n")) {
        if (!ln.trim()) continue;
        try {
          const parsed = JSON.parse(ln) as unknown;
          if (
            parsed !== null &&
            typeof parsed === "object" &&
            isValidMemoryItem((parsed as Record<string, unknown>)["item"])
          ) {
            out.push(parsed as RecordLine);
          }
        } catch {
          // skip malformed lines
        }
      }
      this._cache = out;
      return out;
    } catch (err: unknown) {
      // Only suppress "file not found" — rethrow real I/O errors.
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        this._cache = [];
        return [];
      }
      throw err;
    }
  }

  /** Atomically write records to the JSONL file (tmp → rename), then refresh cache. */
  private async _writeAll(records: RecordLine[]): Promise<void> {
    const dir = path.dirname(this.filePath);
    const tmp = path.join(dir, `.${path.basename(this.filePath)}.tmp`);
    const content = records.map((r) => JSON.stringify(r)).join("\n") + (records.length > 0 ? "\n" : "");
    await fsPromises.writeFile(tmp, content, { encoding: "utf-8", flag: "w" });
    await fsPromises.rename(tmp, this.filePath);
    // Update cache in-place so subsequent reads don't hit disk.
    this._cache = records;
  }
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}
