# openclaw-memory-core: Agent Journal

> **Append-only.** Never delete or edit past entries.
> Every agent session adds a new entry at the top.
> This file is the immutable history of decisions and work done.

---

## 2026-02-27: T-006 Secret scanner and CI guardrails

**Agent:** Claude Opus 4.6
**Phase:** Implementation

### What was done

- Created `.github/workflows/ci.yml` - GitHub Actions CI workflow:
  - Build & Test job with Node.js 18/20/22 matrix (npm ci, tsc --noEmit, build, test)
  - Secret Scan job using gitleaks/gitleaks-action@v2
  - Triggers on push to main and PRs to main
  - Read-only permissions
- Created `.gitleaks.toml` - gitleaks configuration:
  - Extends default gitleaks ruleset
  - Allowlists: node_modules, dist, package-lock.json, .ai, tests (fake secrets in test files)
- Created `scripts/scan-secrets.sh` - local secret scanning:
  - Prefers gitleaks if installed, falls back to built-in grep patterns
  - Patterns: AWS keys, generic secret assignments, private keys, GitHub/npm tokens, long hex secrets
  - Excludes test directory (intentional fake secrets for redaction/injection testing)
- Updated `package.json` with new scripts:
  - `typecheck` - tsc --noEmit
  - `scan-secrets` - runs the local scanner
  - `ci` - full pipeline: typecheck + build + test + scan-secrets
- All 224 tests pass, build clean, secret scan clean

### Decisions made

- Used gitleaks as the primary scanner (industry standard, free for public repos via GitHub Action)
- Built-in fallback scanner for local dev without gitleaks installed
- Excluded tests/ from scanning - test files intentionally contain fake AWS keys, tokens, etc. for redaction/injection testing
- Node.js matrix covers 18 (LTS), 20 (LTS), 22 (current) for broad compatibility
- CI runs on push to main and PRs - catches issues before merge
- Added `npm run ci` as single command for local pre-push validation

---

## 2026-02-27: T-005 TTL/expiry support for memory items

**Agent:** Claude Opus 4.6
**Phase:** Implementation

### What was done

- Added `expiresAt?: string` (ISO 8601) field to `MemoryItem` interface
- Added `ListOpts` interface with `includeExpired` option
- Added `includeExpired` option to `SearchOpts`
- Added `purgeExpired(): Promise<number>` to `MemoryStore` interface and `JsonlMemoryStore`
- Updated `get()` to filter expired items (returns undefined for expired)
- Updated `list()` and `search()` to skip expired items by default
- Added `isExpired()` helper using ISO string comparison (no Date parsing overhead)
- Added `ttlMs(ms)` utility in utils.ts for convenient expiry calculation
- Created `tests/ttl.test.ts` with 24 tests covering: get, list, search, purgeExpired, update interaction, ttlMs utility, and edge cases
- Updated README.md with TTL documentation and usage example
- All 224 tests pass, build clean

### Decisions made

- Lazy expiry (filter at read time) rather than background timers - fits library-first architecture
- `update()` can find expired items (so callers can extend expiry) but `get()` cannot
- ISO string comparison (`<=`) for expiry check - avoids Date parsing, works correctly for ISO 8601
- `purgeExpired()` is explicit (caller decides when to clean up) - no automatic pruning
- `expiresAt` exactly equal to now is treated as expired (consistent with "past or equal" semantics)

---

## 2026-02-27: v0.2 roadmap definition

**Agent:** Claude Opus 4.6
**Phase:** Planning

### What was done

- Verified build health: `npm run build` passes, `npm run test` passes (15/15 tests)
- Analyzed all source files (types.ts, store-jsonl.ts, embedding.ts, redaction.ts, utils.ts, index.ts) for gaps and improvement opportunities
- Created GitHub labels: high-priority, medium-priority, low-priority, testing
- Added labels to 3 existing issues (#1-#3)
- Created 5 new GitHub issues (#4-#8):
  - #4: Add update() method to MemoryStore interface (high-priority)
  - #5: Add TTL/expiry support for memory items (medium-priority)
  - #6: Expand test coverage for embedding, utils, and redaction modules (high-priority)
  - #7: Improve README with full API reference and usage examples (medium-priority)
  - #8: Add bulk operations and append-optimized writes (low-priority)
- Updated DASHBOARD.md with full v0.2 roadmap and suggested implementation order
- Updated STATUS.md with verified build health and roadmap summary
- Updated NEXT_ACTIONS.md with actionable tasks for next agent

### Decisions made

- Prioritized test coverage (#6) as first task since it validates existing code before any changes
- Placed update() method (#4) second as it is a fundamental CRUD gap
- Placed bulk operations (#8) last as it is a performance optimization, not a functional gap
- Existing issues (#1-#3) were labeled but not modified in content

---

## 2026-02-24: Initial scaffold

**Agent:** Human
**Phase:** Setup

### What was done

- Initialized AAHP handoff structure
- Created initial project scaffold (v0.1.0)

---

