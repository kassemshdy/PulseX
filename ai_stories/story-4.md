# Story story-4: Build PostMeta Dynamic Fields System

**Epic:** Content Management
**Status:** todo
**Priority:** high
**Estimate:** 6h
**Assignee:** Unassigned

## Description

As an admin, I want posts to store custom fields defined by their PostType, so that content structure is flexible.

## Acceptance Criteria

- [ ] PostMeta table stores key-value pairs per post
- [ ] Can store different data types (text, number, date, JSON)
- [ ] Meta fields are validated against PostType schema
- [ ] Can query posts by meta field values
- [ ] Efficient indexing for common queries

## Technical Tasks

- [ ] Add database indexes on PostMeta.key
- [ ] Implement meta field validation
- [ ] Add meta upsert logic in PostService
- [ ] Implement meta filtering in queries
- [ ] Add meta field type casting
- [ ] Write tests for different field types

## Tags

backend, database, meta

## Metadata

- **Created:** 2026-01-01T08:00:00Z
- **Updated:** 2026-01-01T08:00:00Z
