# openclaw-memory-core: Build Dashboard

> Single source of truth for build health, test coverage, and pipeline state.
> Updated by agents at the end of every completed task.

---

## Components

| Name | Version | Build | Tests | Status | Notes |
|------|---------|-------|-------|--------|-------|
| openclaw-memory-core | 0.1.0 | OK | OK (109 tests) | Stable | Core utilities library |

**Legend:** OK passing - FAIL failing - stub/mock - pending - blocked

---

## Test Coverage

| Suite | Tests | Status | Last Run |
|-------|-------|--------|----------|
| embedding.test.ts | 24 | OK | 2026-02-27 |
| utils.test.ts | 27 | OK | 2026-02-27 |
| redaction.test.ts | 43 | OK | 2026-02-27 |
| store.test.ts | 15 | OK | 2026-02-27 |

---

## Pipeline State

| Field | Value |
|-------|-------|
| Current task | None |
| Phase | implementing |
| Last completed | T-002: Expand test coverage (2026-02-27) |
| Rate limit | None |

---

## v0.2 Roadmap (GitHub Issues)

| # | Title | Priority | Labels | Status |
|---|-------|----------|--------|--------|
| [#1](https://github.com/homeofe/openclaw-memory-core/issues/1) | Optional semantic embeddings backend | Medium | enhancement, v0.2 | Open |
| [#2](https://github.com/homeofe/openclaw-memory-core/issues/2) | Secret scanner + CI guardrails | Medium | security, v0.2 | Open |
| [#3](https://github.com/homeofe/openclaw-memory-core/issues/3) | Injection/exfiltration test suite | High | security, v0.2 | Open |
| [#4](https://github.com/homeofe/openclaw-memory-core/issues/4) | Add update() method to MemoryStore interface | High | enhancement, v0.2 | Open |
| [#5](https://github.com/homeofe/openclaw-memory-core/issues/5) | Add TTL/expiry support for memory items | Medium | enhancement, v0.2 | Open |
| [#6](https://github.com/homeofe/openclaw-memory-core/issues/6) | Expand test coverage for embedding, utils, and redaction | High | testing, v0.2 | Done |
| [#7](https://github.com/homeofe/openclaw-memory-core/issues/7) | Improve README with full API reference and usage examples | Medium | documentation, v0.2 | Open |
| [#8](https://github.com/homeofe/openclaw-memory-core/issues/8) | Add bulk operations and append-optimized writes | Low | enhancement, v0.2 | Open |

### Suggested implementation order

1. **#6** - Test coverage first (validates existing code before changing it)
2. **#4** - update() method (core CRUD gap)
3. **#3** - Injection/exfiltration test suite (security baseline)
4. **#5** - TTL/expiry support (new feature, builds on tested foundation)
5. **#1** - Optional semantic embeddings backend
6. **#2** - Secret scanner + CI guardrails
7. **#7** - README and API docs (document everything after features stabilize)
8. **#8** - Bulk operations (performance optimization, lowest priority)

---

## Update Instructions (for agents)

After completing any task:

1. Update the relevant row to OK with current date
2. Update test counts
3. Update "Pipeline State"
4. Move completed issues to a "Completed" section or update status
5. Add newly discovered tasks with correct priority
