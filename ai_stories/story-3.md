# Story story-3: Implement Post CRUD Operations

**Epic:** Content Management
**Status:** todo
**Priority:** critical
**Estimate:** 12h
**Assignee:** Unassigned

## Description

As a content editor, I want to create, read, update, and delete posts, so that I can manage content effectively.

## Acceptance Criteria

- [ ] POST /api/posts creates new post with meta fields
- [ ] GET /api/posts lists posts with pagination
- [ ] GET /api/posts/:id returns post with all relationships
- [ ] PUT /api/posts/:id updates post and meta
- [ ] DELETE /api/posts/:id soft deletes post
- [ ] Supports filtering by type, status, date
- [ ] Transaction ensures data consistency

## Technical Tasks

- [ ] Implement PostService.create() with PostMeta
- [ ] Implement PostService.findAll() with filters
- [ ] Implement PostService.findById() with relations
- [ ] Implement PostService.update() with meta updates
- [ ] Implement PostService.delete() as soft delete
- [ ] Add pagination logic
- [ ] Create controller endpoints
- [ ] Write integration tests

## Tags

backend, api, posts

## Metadata

- **Created:** 2026-01-01T08:00:00Z
- **Updated:** 2026-01-01T08:00:00Z
