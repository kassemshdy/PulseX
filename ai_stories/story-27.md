# Story story-27: Implement Cache Invalidation Logic

**Epic:** Caching Layer
**Status:** backlog
**Priority:** high
**Estimate:** 8h
**Assignee:** Unassigned

## Description

As a developer, I want cache invalidation on content updates, so that users always see fresh data.

## Acceptance Criteria

- [ ] Post updates invalidate related caches
- [ ] Term updates invalidate category caches
- [ ] Widget updates invalidate widget caches
- [ ] Pub/sub broadcasts invalidations
- [ ] Pattern-based invalidation works
- [ ] Manual invalidation available

## Technical Tasks

- [ ] Add invalidation logic to PostService
- [ ] Add invalidation to TermService
- [ ] Implement pub/sub invalidation
- [ ] Add pattern-based invalidation
- [ ] Create manual invalidation endpoint
- [ ] Write integration tests

## Tags

backend, caching, invalidation

## Metadata

- **Created:** 2026-01-01T08:00:00Z
- **Updated:** 2026-01-01T08:00:00Z
