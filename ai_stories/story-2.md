# Story story-2: Implement PostType CRUD Operations

**Epic:** Content Management
**Status:** todo
**Priority:** critical
**Estimate:** 8h
**Assignee:** Unassigned

## Description

As an admin, I want to create, read, update, and delete content types dynamically, so that I can configure the CMS for any use case.

## Acceptance Criteria

- [ ] POST /api/post-types creates new type
- [ ] GET /api/post-types lists all types
- [ ] GET /api/post-types/:id returns single type
- [ ] PUT /api/post-types/:id updates type
- [ ] DELETE /api/post-types/:id removes type
- [ ] JSON schema validates field definitions
- [ ] Returns proper error messages

## Technical Tasks

- [ ] Implement PostTypeService.create()
- [ ] Implement PostTypeService.findAll()
- [ ] Implement PostTypeService.findById()
- [ ] Implement PostTypeService.update()
- [ ] Implement PostTypeService.delete()
- [ ] Add Zod schemas for validation
- [ ] Create controller endpoints
- [ ] Write unit tests for service layer

## Tags

backend, api, post-type

## Metadata

- **Created:** 2026-01-01T08:00:00Z
- **Updated:** 2026-01-01T08:00:00Z
