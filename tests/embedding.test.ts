import { describe, it, expect } from "vitest";
import { HashEmbedder, cosine } from "../src/embedding.js";

describe("HashEmbedder", () => {
  it("produces a vector with the configured number of dimensions", async () => {
    const embedder = new HashEmbedder(128);
    const vec = await embedder.embed("hello world");
    expect(vec.length).toBe(128);
  });

  it("defaults to 256 dimensions", async () => {
    const embedder = new HashEmbedder();
    expect(embedder.dims).toBe(256);
    const vec = await embedder.embed("test");
    expect(vec.length).toBe(256);
  });

  it("returns an L2-normalized vector (unit length)", async () => {
    const embedder = new HashEmbedder(64);
    const vec = await embedder.embed("some text with multiple tokens for hashing");
    const magnitude = Math.sqrt(vec.reduce((s, x) => s + x * x, 0));
    expect(magnitude).toBeCloseTo(1.0, 5);
  });

  it("returns a zero-magnitude-safe vector for empty string", async () => {
    const embedder = new HashEmbedder(64);
    const vec = await embedder.embed("");
    // All zeros divided by norm=1 should yield all zeros
    expect(vec.length).toBe(64);
    expect(vec.every((x) => x === 0)).toBe(true);
  });

  it("produces deterministic output for the same input", async () => {
    const embedder = new HashEmbedder(64);
    const a = await embedder.embed("deterministic test");
    const b = await embedder.embed("deterministic test");
    expect(a).toEqual(b);
  });

  it("produces different vectors for different inputs", async () => {
    const embedder = new HashEmbedder(64);
    const a = await embedder.embed("cat");
    const b = await embedder.embed("astrophysics");
    // Vectors should not be identical
    const identical = a.every((v, i) => v === b[i]);
    expect(identical).toBe(false);
  });

  it("is case-insensitive", async () => {
    const embedder = new HashEmbedder(64);
    const a = await embedder.embed("Hello World");
    const b = await embedder.embed("hello world");
    expect(a).toEqual(b);
  });

  it("strips punctuation before hashing", async () => {
    const embedder = new HashEmbedder(64);
    const a = await embedder.embed("hello, world!");
    const b = await embedder.embed("hello world");
    expect(a).toEqual(b);
  });

  it("has the correct id property", () => {
    const embedder = new HashEmbedder();
    expect(embedder.id).toBe("hash-embedder-v1");
  });

  it("gives high similarity for identical text", async () => {
    const embedder = new HashEmbedder(128);
    const v = await embedder.embed("identical text");
    const sim = cosine(v, v);
    expect(sim).toBeCloseTo(1.0, 5);
  });

  it("gives higher similarity for related text than unrelated text", async () => {
    const embedder = new HashEmbedder(128);
    const base = await embedder.embed("programming language typescript javascript");
    const related = await embedder.embed("typescript programming language");
    const unrelated = await embedder.embed("banana strawberry fruit smoothie");
    const simRelated = cosine(base, related);
    const simUnrelated = cosine(base, unrelated);
    expect(simRelated).toBeGreaterThan(simUnrelated);
  });
});

describe("cosine", () => {
  it("returns 1.0 for identical unit vectors", () => {
    const v = [1, 0, 0];
    expect(cosine(v, v)).toBeCloseTo(1.0, 10);
  });

  it("returns 0 for orthogonal vectors", () => {
    const a = [1, 0, 0];
    const b = [0, 1, 0];
    expect(cosine(a, b)).toBeCloseTo(0, 10);
  });

  it("returns -1 for opposite vectors", () => {
    const a = [1, 0, 0];
    const b = [-1, 0, 0];
    expect(cosine(a, b)).toBeCloseTo(-1.0, 10);
  });

  it("handles vectors of different lengths by using the shorter", () => {
    const a = [1, 0, 0, 999];
    const b = [1, 0, 0];
    // Should only use the first 3 elements
    expect(cosine(a, b)).toBeCloseTo(1.0, 10);
  });

  it("returns 0 for zero vectors", () => {
    const a = [0, 0, 0];
    const b = [0, 0, 0];
    expect(cosine(a, b)).toBe(0);
  });
});
