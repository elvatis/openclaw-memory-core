# openclaw-memory-core: Next Actions for Incoming Agent

> Priority order. Work top-down.
> Each item should be self-contained, the agent must be able to start without asking questions.
> Blocked tasks go to the bottom. Completed tasks move to "Recently Completed".

---

## Status Summary

| Status | Count |
|--------|-------|
| Done | 10 |
| Ready | 7 |
| Blocked | 0 |

---

## Ready - Work These Next

> Note: T-010 through T-016 were imported from the same GitHub issues already completed by T-002 through T-008.
> Verify the corresponding GitHub issue is still open before starting work - the underlying feature may already exist.

### T-010: Improve README with full API reference and usage examples (GitHub issue #7)

**Goal:** Comprehensive README with install instructions, full API surface, and usage examples.

**Context:** The README was already extensively expanded by T-007. Check current state before making changes.

**What to do:**
1. Read the current README.md
2. Compare against issue #7 requirements
3. Fill any remaining gaps (if any)
4. Run `npm run ci`

**Files:** `README.md`

**Definition of done:**
- README covers all exported types, classes, and functions
- Usage examples for store, redaction, embedding, utils
- Build and tests pass

---

### T-012: Add TTL/expiry support for memory items (GitHub issue #5)

**Goal:** Add optional `expiresAt` field with automatic filtering and purge.

**Context:** TTL/expiry was already implemented by T-005. Verify the current state before starting.

**What to do:**
1. Check if `expiresAt` field exists in MemoryItem
2. Check if `purgeExpired()` exists
3. Check if search/list/get filter expired items
4. Fill any remaining gaps (if any)
5. Run `npm run ci`

**Files:** `src/types.ts`, `src/store-jsonl.ts`, `tests/ttl.test.ts`

**Definition of done:**
- `expiresAt` field on MemoryItem
- Expired items filtered from reads
- `purgeExpired()` method
- Tests pass

---

### T-013: Add update() method to MemoryStore interface (GitHub issue #4)

**Goal:** Partial update support with automatic re-embedding on text changes.

**Context:** `update()` was already implemented by T-003. Verify the current state before starting.

**What to do:**
1. Check if `update()` exists in MemoryStore interface and JsonlMemoryStore
2. Fill any remaining gaps (if any)
3. Run `npm run ci`

**Files:** `src/types.ts`, `src/store-jsonl.ts`, `tests/store.test.ts`

**Definition of done:**
- `update()` in interface and implementation
- Re-embeds when text changes
- Tests pass

---

### T-015: Secret scanner + CI guardrails (GitHub issue #2)

**Goal:** CI job and optional pre-commit hook to scan for secrets before merge.

**Context:** Secret scanner was already implemented by T-006. Verify the current state before starting.

**What to do:**
1. Check if `scripts/scan-secrets.sh` exists
2. Check if `.github/workflows/ci.yml` includes secret scanning
3. Check if `.gitleaks.toml` exists
4. Fill any remaining gaps (if any)
5. Run `npm run ci`

**Files:** `scripts/scan-secrets.sh`, `.github/workflows/ci.yml`, `.gitleaks.toml`

**Definition of done:**
- Secret scanner in CI
- Docs for allowlist handling
- Build and tests pass

---

### T-016: Optional semantic embeddings backend (GitHub issue #1)

**Goal:** Pluggable embedder backend with the HashEmbedder as safe default.

**Context:** The `Embedder` interface and `createEmbedder()` factory already exist. Check if issue #1 requirements are fully met.

**What to do:**
1. Check if `Embedder` interface supports custom providers
2. Check if `createEmbedder()` factory handles custom vs default
3. Check if README documents how to swap embedders
4. Fill any remaining gaps (if any)
5. Run `npm run ci`

**Files:** `src/types.ts`, `src/embedding.ts`, `README.md`

**Definition of done:**
- Embedder interface documented
- createEmbedder() supports custom providers
- Config examples in README
- Tests pass

---

### T-011: Expand test coverage for embedding, utils, and redaction (GitHub issue #6)

**Goal:** Unit tests for all exported functions across embedding, utils, and redaction modules.

**Context:** Test coverage was already expanded by T-002 (from 15 to 109+ tests). Verify current state.

**What to do:**
1. Check current test coverage in `tests/`
2. Identify any remaining gaps
3. Fill gaps (if any)
4. Run `npm run ci`

**Files:** `tests/embedding.test.ts`, `tests/utils.test.ts`, `tests/redaction.test.ts`

**Definition of done:**
- Every exported function has at least one test
- Build and all tests pass

---

### T-014: Injection/exfiltration test suite (GitHub issue #3)

**Goal:** Security test fixtures covering prompt injection, exfiltration attempts, and encoded payloads.

**Context:** Injection tests were already implemented by T-004 (67 tests across 14 categories). Verify current state.

**What to do:**
1. Check `tests/injection.test.ts` exists and covers the required categories
2. Fill any remaining gaps (if any)
3. Run `npm run ci`

**Files:** `tests/injection.test.ts`

**Definition of done:**
- Prompt injection test fixtures
- Exfiltration attempt tests
- Encoded payload tests
- All tests in CI

---

## Blocked

_No blocked tasks._

---

## Recently Completed

| Task | Date | Resolution |
|------|------|------------|
| T-009: Bulk operations and append-optimized writes | 2026-03-01 | deleteMany() added to interface and implementation. 8 new tests (262 total). |
| T-008: Bulk operations (addMany) | 2026-02-27 | addMany() documented in README. Implementation existed from prior sessions. |
| T-007: README with full API reference | 2026-02-27 | Comprehensive README with all types, classes, functions, examples. |
| T-006: Secret scanner + CI guardrails | 2026-02-27 | scan-secrets.sh, gitleaks config, CI workflow. |
| T-005: TTL/expiry support | 2026-02-27 | expiresAt field, purgeExpired(), automatic filtering. |

---

## Reference: Key File Locations

| What | Where |
|------|-------|
| Source | `src/` (types.ts, store-jsonl.ts, embedding.ts, redaction.ts, utils.ts) |
| Build config | `tsconfig.json` |
| Tests | `tests/` (store, embedding, utils, redaction, ttl, injection) |
| CI | `.github/workflows/ci.yml` |
| GitHub Issues | https://github.com/elvatis/openclaw-memory-core/issues |
