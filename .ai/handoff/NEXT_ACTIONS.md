# openclaw-memory-core: Next Actions for Incoming Agent

> Priority order. Work top-down.
> Each item should be self-contained, the agent must be able to start without asking questions.
> Blocked tasks go to the bottom. Completed tasks move to "Recently Completed".

---

## Status Summary

| Status | Count |
|--------|-------|
| Done | 17 |
| Ready | 0 |
| Blocked | 0 |

---

## Ready - Work These Next

_All v0.2 roadmap tasks are complete. No tasks remaining._

To continue development, define new tasks (e.g., v0.3 roadmap) by creating GitHub issues and adding them to the MANIFEST.

---

## Blocked

_No blocked tasks._

---

## Recently Completed

| Task | Date | Resolution |
|------|------|------------|
| T-010: README with full API reference | 2026-03-01 | Added missing Redactor and ToolCallParams types. Full API surface documented. |
| T-009: Bulk operations (deleteMany) | 2026-03-01 | deleteMany() added to interface and implementation. 8 new tests (262 total). |
| T-008: Bulk operations (addMany) | 2026-02-27 | addMany() with append-optimized writes and parallel embedding. |
| T-007: README with full API reference | 2026-02-27 | Comprehensive README with all types, classes, functions, examples. |
| T-006: Secret scanner + CI guardrails | 2026-02-27 | scan-secrets.sh, gitleaks config, CI workflow. |

---

## v0.2 Completion Summary

All 16 tasks from the v0.2 roadmap are complete. GitHub issues #1-#8 are all closed.

| Area | Tasks | Key deliverables |
|------|-------|-----------------|
| Test coverage | T-002, T-011 | 262 tests across 6 test files |
| Features | T-003/T-013 (update), T-005/T-012 (TTL), T-008/T-009 (bulk ops) | Full CRUD, TTL/expiry, addMany/deleteMany |
| Security | T-004/T-014 (injection tests), T-006/T-015 (secret scanner) | 91 injection tests, CI secret scanning |
| Docs | T-007/T-010 (README) | 530+ line API reference with examples |
| Architecture | T-016 (embedder backend) | Pluggable Embedder interface with docs |
| Planning | T-001 (roadmap) | 8 GitHub issues defined and prioritized |

---

## Reference: Key File Locations

| What | Where |
|------|-------|
| Source | `src/` (types.ts, store-jsonl.ts, embedding.ts, redaction.ts, utils.ts) |
| Build config | `tsconfig.json` |
| Tests | `tests/` (store, embedding, utils, redaction, ttl, injection) |
| CI | `.github/workflows/ci.yml` |
| GitHub Issues | https://github.com/elvatis/openclaw-memory-core/issues |
