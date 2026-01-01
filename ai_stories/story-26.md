# Story story-26: Implement Multi-Tier Cache Service

**Epic:** Caching Layer
**Status:** backlog
**Priority:** high
**Estimate:** 10h
**Assignee:** Unassigned

## Description

As a developer, I want L1 (in-memory) and L2 (Redis) caching, so that reads are extremely fast.

## Acceptance Criteria

- [ ] L1 cache uses LRU in-memory cache
- [ ] L2 cache uses Redis
- [ ] Get checks L1 then L2 then source
- [ ] Set updates both L1 and L2
- [ ] TTL configurable per cache type
- [ ] Cache hit/miss metrics available

## Technical Tasks

- [ ] Implement MemoryCacheClient with LRU
- [ ] Update RedisClient for L2
- [ ] Create CacheService with tiered logic
- [ ] Add TTL support
- [ ] Implement metrics tracking
- [ ] Write unit tests
- [ ] Performance test

## Tags

backend, caching, performance

## Metadata

- **Created:** 2026-01-01T08:00:00Z
- **Updated:** 2026-01-01T08:00:00Z
