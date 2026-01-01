# Story story-17: Setup BullMQ for Background Jobs

**Epic:** Social Media Automation
**Status:** backlog
**Priority:** critical
**Estimate:** 8h
**Assignee:** Unassigned

## Description

As a developer, I want a job queue system, so that long-running tasks don't block the API.

## Acceptance Criteria

- [ ] BullMQ configured with Redis
- [ ] Can add jobs to queue
- [ ] Worker processes jobs in background
- [ ] Job progress tracked in database
- [ ] Failed jobs are retried
- [ ] Dashboard shows job status

## Technical Tasks

- [ ] Install BullMQ and dependencies
- [ ] Configure Redis connection
- [ ] Create QueueService abstraction
- [ ] Implement worker process
- [ ] Add job progress tracking
- [ ] Setup job retry logic
- [ ] Add Bull Board dashboard

## Tags

backend, queue, bullmq

## Metadata

- **Created:** 2026-01-01T08:00:00Z
- **Updated:** 2026-01-01T08:00:00Z
