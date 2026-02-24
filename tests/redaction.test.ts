import { describe, it, expect } from "vitest";
import { DefaultRedactor } from "../src/redaction.js";

describe("DefaultRedactor", () => {
  it("redacts google keys", () => {
    const r = new DefaultRedactor();
    // Example token format only (not a real key)
    const out = r.redact("key=AIzaSyExampleExampleExampleExample1234");
    expect(out.hadSecrets).toBe(true);
    expect(out.redactedText).toContain("[REDACTED:GOOGLE_KEY]");
  });

  it("redacts private key blocks", () => {
    const r = new DefaultRedactor();
    const out = r.redact("-----BEGIN RSA PRIVATE KEY-----\nabc\n-----END RSA PRIVATE KEY-----");
    expect(out.redactedText).toContain("[REDACTED:PRIVATE_KEY_BLOCK]");
  });
});
