# openclaw-memory-core: Next Actions for Incoming Agent

> Priority order. Work top-down.
> Each item should be self-contained, the agent must be able to start without asking questions.
> Blocked tasks go to the bottom. Completed tasks move to "Recently Completed".

---

## T-001: Define v0.2 roadmap items as issues and prioritize

**Goal:** Create a clear v0.2 roadmap by writing GitHub issues for each planned feature and ordering them by priority.

**Context:**
- v0.1.0 scaffold is in place (redaction, local store, embeddings stubs)
- No formal roadmap or issue tracker has been populated yet

**What to do:**
1. Review `src/` to identify gaps and planned features
2. Open GitHub issues for each roadmap item with clear acceptance criteria
3. Add priority labels (high / medium / low)
4. Update `DASHBOARD.md` with the new task list
5. Update `STATUS.md` after completion

**Definition of done:**
- [ ] At least 3 GitHub issues created and labeled
- [ ] `DASHBOARD.md` updated with new tasks
- [ ] `STATUS.md` updated

---

## Recently Completed

| Item | Resolution |
|------|-----------|
| Initial scaffold | Created 2026-02-24 |

---

## Reference: Key File Locations

| What | Where |
|------|-------|
| Source | `src/index.ts` |
| Build config | `tsconfig.json` |
| Tests | `tests/` |

