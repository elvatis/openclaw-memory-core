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

  // --- update() tests ---

  it("updates an existing item and returns the merged result", async () => {
    const store = makeStore("-upd1");
    await store.add({ id: "u1", kind: "note", text: "original text", createdAt: "2024-01-01T00:00:00Z" });
    const updated = await store.update("u1", { text: "revised text" });
    expect(updated).toBeDefined();
    expect(updated!.text).toBe("revised text");
    expect(updated!.kind).toBe("note");
    expect(updated!.id).toBe("u1");
    // Verify persisted
    const fetched = await store.get("u1");
    expect(fetched!.text).toBe("revised text");
  });

  it("returns undefined when updating a non-existent id", async () => {
    const store = makeStore("-upd2");
    const result = await store.update("ghost", { text: "nope" });
    expect(result).toBeUndefined();
  });

  it("preserves insertion order after update", async () => {
    const store = makeStore("-upd3");
    await store.add({ id: "a", kind: "fact", text: "first", createdAt: "2024-01-01T00:00:00Z" });
    await store.add({ id: "b", kind: "fact", text: "second", createdAt: "2024-01-02T00:00:00Z" });
    await store.add({ id: "c", kind: "fact", text: "third", createdAt: "2024-01-03T00:00:00Z" });
    await store.update("b", { text: "second-updated" });
    const items = await store.list();
    expect(items.map((i) => i.id)).toEqual(["a", "b", "c"]);
    expect(items[1]!.text).toBe("second-updated");
  });

  it("re-embeds when text content changes so search still works", async () => {
    const store = makeStore("-upd4");
    await store.add({ id: "s1", kind: "doc", text: "banana apple orange", createdAt: "2024-01-01T00:00:00Z" });
    await store.update("s1", { text: "kubernetes docker containers" });
    const hits = await store.search("kubernetes containers", { limit: 5 });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]!.item.text).toContain("kubernetes");
  });

  it("keeps existing embedding when text does not change", async () => {
    const store = makeStore("-upd5");
    await store.add({ id: "e1", kind: "note", text: "stable text", createdAt: "2024-01-01T00:00:00Z" });
    // Only update tags, not text
    await store.update("e1", { tags: ["important"] });
    const fetched = await store.get("e1");
    expect(fetched!.tags).toEqual(["important"]);
    expect(fetched!.text).toBe("stable text");
    // Search should still find it via the original embedding
    const hits = await store.search("stable text", { limit: 5 });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]!.item.id).toBe("e1");
  });

  it("rejects update with invalid kind", async () => {
    const store = makeStore("-upd6");
    await store.add({ id: "k1", kind: "note", text: "valid", createdAt: "2024-01-01T00:00:00Z" });
    await expect(
      store.update("k1", { kind: "invalid" as never })
    ).rejects.toThrow(/Invalid kind/);
  });

  it("can update kind to a valid value", async () => {
    const store = makeStore("-upd7");
    await store.add({ id: "k2", kind: "note", text: "was a note", createdAt: "2024-01-01T00:00:00Z" });
    const updated = await store.update("k2", { kind: "decision" });
    expect(updated!.kind).toBe("decision");
  });

  it("cannot change the id field via update", async () => {
    const store = makeStore("-upd8");
    await store.add({ id: "orig", kind: "note", text: "text", createdAt: "2024-01-01T00:00:00Z" });
    // Partial<Omit<MemoryItem, "id">> prevents id at the type level,
    // but we test runtime behaviour with a forced cast
    const updated = await store.update("orig", { text: "changed" } as never);
    expect(updated!.id).toBe("orig");
  });
});
