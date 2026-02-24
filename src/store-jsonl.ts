import fs from "node:fs";
import path from "node:path";
import type { Embedder, MemoryItem, MemoryStore, SearchHit } from "./types.js";
import { cosine } from "./embedding.js";

type RecordLine = {
  item: MemoryItem;
  embedding?: number[];
};

export class JsonlMemoryStore implements MemoryStore {
  private filePath: string;
  private embedder: Embedder;

  constructor(opts: { filePath: string; embedder: Embedder }) {
    this.filePath = opts.filePath;
    this.embedder = opts.embedder;
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    if (!fs.existsSync(this.filePath)) fs.writeFileSync(this.filePath, "", "utf-8");
  }

  async add(item: MemoryItem): Promise<void> {
    const embedding = await this.embedder.embed(item.text);
    const line: RecordLine = { item, embedding };
    fs.appendFileSync(this.filePath, JSON.stringify(line) + "\n", "utf-8");
  }

  async list(opts?: { limit?: number }): Promise<MemoryItem[]> {
    const lines = readJsonl(this.filePath);
    const items = lines.map((r) => r.item);
    const lim = opts?.limit ?? items.length;
    return items.slice(-lim);
  }

  async search(query: string, opts?: { limit?: number }): Promise<SearchHit[]> {
    const q = await this.embedder.embed(query);
    const records = readJsonl(this.filePath);
    const hits: SearchHit[] = [];

    for (const r of records) {
      if (!r.embedding) continue;
      hits.push({ item: r.item, score: clamp01((cosine(q, r.embedding) + 1) / 2) });
    }

    hits.sort((a, b) => b.score - a.score);
    return hits.slice(0, opts?.limit ?? 10);
  }
}

function readJsonl(filePath: string): RecordLine[] {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const out: RecordLine[] = [];
    for (const ln of raw.split("\n")) {
      if (!ln.trim()) continue;
      try {
        out.push(JSON.parse(ln));
      } catch {
        // skip bad line
      }
    }
    return out;
  } catch {
    return [];
  }
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}
