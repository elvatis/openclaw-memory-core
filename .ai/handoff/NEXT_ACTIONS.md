# openclaw-memory-core: Next Actions for Incoming Agent

> Priority order. Work top-down.
> Each item should be self-contained, the agent must be able to start without asking questions.
> Blocked tasks go to the bottom. Completed tasks move to "Recently Completed".

---

## T-002: Expand test coverage (GitHub issue #6)

**Goal:** Add unit tests for embedding.ts, utils.ts, and expand redaction.test.ts to cover all 20 rules.

**Context:**
- Currently 15 tests in 2 files (store.test.ts, redaction.test.ts)
- embedding.ts and utils.ts have zero tests
- Only 8 of 20 redaction rules are tested

**What to do:**
1. Create `tests/embedding.test.ts` - test HashEmbedder dimensions, determinism, normalization; test cosine similarity
2. Create `tests/utils.test.ts` - test expandHome, safePath (including path traversal rejection), safeLimit
3. Expand `tests/redaction.test.ts` - add tests for all untested rules (OpenAI, Anthropic, Stripe, AWS, Azure, JWT, Bearer, HuggingFace, Telegram, DB connection strings)
4. Run `npm run test` and verify all pass
5. Update DASHBOARD.md test counts

**Definition of done:**
- [ ] At least 35 total tests passing
- [ ] Every exported function has at least one test

---

## T-003: Add update() method to MemoryStore (GitHub issue #4)

**Goal:** Add a `update()` method to the MemoryStore interface and implement it in JsonlMemoryStore.

**Context:**
- Current interface only has add/get/delete/search/list
- Updating requires delete+add which loses insertion order

**What to do:**
1. Add `update(id: string, patch: Partial<Omit<MemoryItem, 'id'>>): Promise<MemoryItem | undefined>` to MemoryStore interface
2. Implement in JsonlMemoryStore with re-embedding when text changes
3. Add unit tests
4. Run `npm run build` and `npm run test`

**Definition of done:**
- [ ] Interface updated in types.ts
- [ ] Implementation in store-jsonl.ts
- [ ] At least 4 unit tests pass
- [ ] Build and all tests pass

---

## T-004: Injection/exfiltration test suite (GitHub issue #3)

**Goal:** Create security test fixtures and tests verifying plugins do not store secrets and do not execute payloads.

**What to do:**
1. Create test fixtures with prompt injection patterns, exfiltration attempts, encoded payloads
2. Verify redactor catches them
3. Verify store does not execute any content
4. Add to CI

---

## Recently Completed

| Item | Resolution |
|------|-----------|
| T-001: Define v0.2 roadmap | Completed 2026-02-27 - 5 new issues created (#4-#8), 3 existing labeled (#1-#3) |
| Initial scaffold | Created 2026-02-24 |

---

## Reference: Key File Locations

| What | Where |
|------|-------|
| Source | `src/index.ts` |
| Build config | `tsconfig.json` |
| Tests | `tests/` |
| GitHub Issues | https://github.com/homeofe/openclaw-memory-core/issues |

