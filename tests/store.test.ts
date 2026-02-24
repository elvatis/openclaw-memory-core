import { describe, it, expect } from "vitest";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { HashEmbedder } from "../src/embedding.js";
import { JsonlMemoryStore } from "../src/store-jsonl.js";

describe("JsonlMemoryStore", () => {
  it("adds and searches", async () => {
    const filePath = join(tmpdir(), `mem-${Date.now()}.jsonl`);
    const store = new JsonlMemoryStore({ filePath, embedder: new HashEmbedder(64) });

    await store.add({
      id: "1",
      kind: "doc",
      text: "Dubai setup checklist: residency, bank, freezone",
      createdAt: new Date().toISOString(),
      tags: ["LOCAL_PROJECT"],
    });

    const hits = await store.search("LOCAL_PROJECT residency", { limit: 5 });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].item.text).toContain("Dubai");
  });
});
