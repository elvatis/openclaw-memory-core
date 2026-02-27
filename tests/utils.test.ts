import { describe, it, expect } from "vitest";
import { uuid } from "../src/index.js";
import { expandHome, safeLimit } from "../src/utils.js";
import os from "node:os";
import path from "node:path";

describe("uuid", () => {
  it("returns a string in UUID v4 format", () => {
    const id = uuid();
    // UUID v4: 8-4-4-4-12 hex characters
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    expect(id).toMatch(uuidRe);
  });

  it("generates unique IDs across multiple calls", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(uuid());
    }
    expect(ids.size).toBe(100);
  });

  it("sets version nibble to 4", () => {
    const id = uuid();
    // The 13th character (index 14 considering hyphens) should be '4'
    expect(id[14]).toBe("4");
  });

  it("sets variant bits correctly (8, 9, a, or b)", () => {
    const id = uuid();
    // The 17th hex digit (index 19 considering hyphens) should be 8, 9, a, or b
    expect(id[19]).toMatch(/[89ab]/);
  });
});

describe("expandHome", () => {
  it("expands ~ to the home directory", () => {
    const result = expandHome("~");
    expect(result).toBe(os.homedir());
  });

  it("expands ~/subpath to home + subpath", () => {
    const result = expandHome("~/documents");
    expect(result).toBe(path.join(os.homedir(), "documents"));
  });

  it("returns non-tilde paths unchanged", () => {
    expect(expandHome("/usr/local")).toBe("/usr/local");
    expect(expandHome("relative/path")).toBe("relative/path");
  });

  it("returns empty string unchanged", () => {
    expect(expandHome("")).toBe("");
  });
});

describe("safeLimit", () => {
  it("returns the value when it is a valid number within range", () => {
    expect(safeLimit(5, 10, 100)).toBe(5);
  });

  it("returns default for NaN inputs", () => {
    expect(safeLimit("abc", 10, 100)).toBe(10);
    expect(safeLimit(undefined, 10, 100)).toBe(10);
    expect(safeLimit(null, 10, 100)).toBe(10);
  });

  it("returns default for values less than 1", () => {
    expect(safeLimit(0, 10, 100)).toBe(10);
    expect(safeLimit(-5, 10, 100)).toBe(10);
  });

  it("clamps to max when value exceeds max", () => {
    expect(safeLimit(200, 10, 100)).toBe(100);
  });

  it("truncates floating point values", () => {
    expect(safeLimit(5.9, 10, 100)).toBe(5);
  });

  it("accepts string-encoded numbers", () => {
    expect(safeLimit("42", 10, 100)).toBe(42);
  });
});
