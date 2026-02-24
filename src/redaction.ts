import type { RedactionResult, Redactor } from "./types.js";

type Rule = {
  id: string;
  re: RegExp;
  replaceWith: string;
};

// Conservative patterns: detect common secret formats without over-matching.
const RULES: Rule[] = [
  { id: "openai_api_key", re: /\bsk-[A-Za-z0-9]{20,}\b/g, replaceWith: "[REDACTED:OPENAI_KEY]" },
  { id: "github_pat", re: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g, replaceWith: "[REDACTED:GITHUB_PAT]" },
  { id: "github_token", re: /\bgh[pous]_[A-Za-z0-9]{30,}\b/g, replaceWith: "[REDACTED:GITHUB_TOKEN]" },
  { id: "google_api_key", re: /\bAIzaSy[A-Za-z0-9_-]{20,}\b/g, replaceWith: "[REDACTED:GOOGLE_KEY]" },
  { id: "aws_access_key", re: /\bAKIA[0-9A-Z]{16}\b/g, replaceWith: "[REDACTED:AWS_ACCESS_KEY]" },
  { id: "aws_secret_key", re: /\b(?:AWS_SECRET_ACCESS_KEY|aws_secret_access_key)\b\s*[:=]\s*['\"]?[A-Za-z0-9/+=]{30,}['\"]?/gi, replaceWith: "AWS_SECRET_ACCESS_KEY=[REDACTED]" },
  { id: "private_key_block", re: /-----BEGIN ([A-Z ]+)PRIVATE KEY-----[\s\S]*?-----END \1PRIVATE KEY-----/g, replaceWith: "[REDACTED:PRIVATE_KEY_BLOCK]" },
  { id: "bearer_token", re: /\bBearer\s+[A-Za-z0-9\-\._~\+\/]+=*\b/g, replaceWith: "Bearer [REDACTED]" },
];

export class DefaultRedactor implements Redactor {
  redact(text: string): RedactionResult {
    let out = text;
    const matches: RedactionResult["matches"] = [];

    for (const rule of RULES) {
      const found = out.match(rule.re);
      if (found && found.length > 0) {
        for (const m of found.slice(0, 5)) {
          matches.push({ rule: rule.id, match: m.slice(0, 80) });
        }
        out = out.replace(rule.re, rule.replaceWith);
      }
    }

    return {
      redactedText: out,
      hadSecrets: matches.length > 0,
      matches,
    };
  }
}
