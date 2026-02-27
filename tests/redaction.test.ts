import { describe, it, expect } from "vitest";
import { DefaultRedactor } from "../src/redaction.js";

describe("DefaultRedactor", () => {
  it("redacts google keys", () => {
    const r = new DefaultRedactor();
    const out = r.redact("key=AIzaSyExampleExampleExampleExample1234");
    expect(out.hadSecrets).toBe(true);
    expect(out.redactedText).toContain("[REDACTED:GOOGLE_KEY]");
  });

  it("redacts private key blocks", () => {
    const r = new DefaultRedactor();
    const out = r.redact("-----BEGIN RSA PRIVATE KEY-----\nabc\n-----END RSA PRIVATE KEY-----");
    expect(out.redactedText).toContain("[REDACTED:PRIVATE_KEY_BLOCK]");
  });

  it("redacts npm tokens", () => {
    const r = new DefaultRedactor();
    const out = r.redact("token: npm_abcdefghijklmnopqrstuvwxyz1234");
    expect(out.hadSecrets).toBe(true);
    expect(out.redactedText).toContain("[REDACTED:NPM_TOKEN]");
  });

  it("redacts Slack tokens", () => {
    const r = new DefaultRedactor();
    // Construct fake token at runtime to avoid triggering GitHub push protection
    const fakeSlackToken = ["xoxb", "12345678901", "12345678901", "abcdefghijklmnopq"].join("-");
    const out = r.redact(`slack_token=${fakeSlackToken}`);
    expect(out.hadSecrets).toBe(true);
    expect(out.redactedText).toContain("[REDACTED:SLACK_TOKEN]");
  });

  it("redacts SendGrid API keys", () => {
    const r = new DefaultRedactor();
    const out = r.redact("key=SG.abcdefghijklmnopqrstu.vwxyzABCDEFGHIJKLMNOPQRSTUV");
    expect(out.hadSecrets).toBe(true);
    expect(out.redactedText).toContain("[REDACTED:SENDGRID_KEY]");
  });

  it("redacts Vault service tokens", () => {
    const r = new DefaultRedactor();
    const out = r.redact("VAULT_TOKEN=hvs.abcdefghijklmnopqrstuvwxyz1234");
    expect(out.hadSecrets).toBe(true);
    expect(out.redactedText).toContain("[REDACTED:VAULT_TOKEN]");
  });

  it("redacts generic password= patterns", () => {
    const r = new DefaultRedactor();
    const out = r.redact("password=supersecret123");
    expect(out.hadSecrets).toBe(true);
    expect(out.redactedText).toContain("password=[REDACTED]");
  });

  it("does not redact short/safe strings", () => {
    const r = new DefaultRedactor();
    const out = r.redact("Hello world, this is a normal message.");
    expect(out.hadSecrets).toBe(false);
    expect(out.redactedText).toBe("Hello world, this is a normal message.");
  });
});
