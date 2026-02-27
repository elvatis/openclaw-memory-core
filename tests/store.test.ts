import { describe, it, expect } from "vitest";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { HashEmbedder } from "../src/embedding.js";
import { JsonlMemoryStore } from "../src/store-jsonl.js";

function makeStore(suffix = "") {
  const filePath = join(tmpdir(), `mem-${Date.now()}${suffix}.jsonl`);
  return new JsonlMemoryStore({ filePath, embedder: new HashEmbedder(64) });
}

describe("JsonlMemoryStore", () => {
  it("adds and searches", async () => {
    const store = makeStore();
    await store.add({
      id: "1",
      kind: "doc",
      text: "Project setup checklist: residency, bank, company formation",
      createdAt: new Date().toISOString(),
      tags: ["project"],
    });
    const hits = await store.search("residency checklist", { limit: 5 });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]!.item.text).toContain("residency");
  });

  it("deletes an item by id", async () => {
    const store = makeStore("-del");
    await store.add({ id: "a", kind: "note", text: "delete me", createdAt: new Date().toISOString() });
    const deleted = await store.delete("a");
    expect(deleted).toBe(true);
    const items = await store.list();
    expect(items.find((i) => i.id === "a")).toBeUndefined();
  });

  it("returns false when deleting non-existent id", async () => {
    const store = makeStore("-del2");
    const deleted = await store.delete("ghost");
    expect(deleted).toBe(false);
  });

  it("lists items in insertion order (most recent last)", async () => {
    const store = makeStore("-list");
    for (let i = 1; i <= 3; i++) {
      await store.add({ id: String(i), kind: "fact", text: `fact ${i}`, createdAt: new Date().toISOString() });
    }
    const items = await store.list({ limit: 3 });
    expect(items.map((i) => i.id)).toEqual(["1", "2", "3"]);
  });

  it("filters list by kind", async () => {
    const store = makeStore("-kind");
    await store.add({ id: "d1", kind: "doc", text: "a doc", createdAt: new Date().toISOString() });
    await store.add({ id: "n1", kind: "note", text: "a note", createdAt: new Date().toISOString() });
    const docs = await store.list({ kind: "doc" });
    expect(docs.every((i) => i.kind === "doc")).toBe(true);
    expect(docs.find((i) => i.id === "d1")).toBeDefined();
  });

  it("rejects items with invalid kind", async () => {
    const store = makeStore("-inv");
    await expect(
      store.add({ id: "bad", kind: "invalid" as never, text: "x", createdAt: new Date().toISOString() })
    ).rejects.toThrow(/Invalid kind/);
  });

  it("handles concurrent adds without data loss", async () => {
    const store = makeStore("-concurrent");
    await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        store.add({ id: String(i), kind: "note", text: `note ${i}`, createdAt: new Date().toISOString() })
      )
    );
    const items = await store.list();
    expect(items.length).toBe(10);
  });
});
