# Story story-8: Implement Resumable File Uploads

**Epic:** Media Library
**Status:** backlog
**Priority:** high
**Estimate:** 16h
**Assignee:** Unassigned

## Description

As a content editor, I want to upload large video files with resume capability, so that uploads don't fail on network issues.

## Acceptance Criteria

- [ ] Uses tus protocol for resumable uploads
- [ ] Can pause and resume uploads
- [ ] Shows upload progress
- [ ] Handles network interruptions gracefully
- [ ] Cleans up abandoned uploads

## Technical Tasks

- [ ] Install tus-node-server
- [ ] Configure tus endpoints
- [ ] Add upload progress tracking
- [ ] Implement cleanup job
- [ ] Create frontend upload component
- [ ] Test with large files
- [ ] Handle concurrent uploads

## Tags

backend, upload, tus

## Metadata

- **Created:** 2026-01-01T08:00:00Z
- **Updated:** 2026-01-01T08:00:00Z
