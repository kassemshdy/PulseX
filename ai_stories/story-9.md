# Story story-9: Add Image Processing & Thumbnails

**Epic:** Media Library
**Status:** backlog
**Priority:** high
**Estimate:** 10h
**Assignee:** Unassigned

## Description

As a content editor, I want uploaded images to be automatically optimized and have thumbnails generated, so that the site loads faster.

## Acceptance Criteria

- [ ] Images are compressed on upload
- [ ] Multiple thumbnail sizes generated (small, medium, large)
- [ ] Original file is preserved
- [ ] WebP versions created for modern browsers
- [ ] Metadata extracted (dimensions, EXIF)

## Technical Tasks

- [ ] Install sharp library
- [ ] Create ImageProcessingService
- [ ] Add thumbnail generation logic
- [ ] Implement WebP conversion
- [ ] Extract and store metadata
- [ ] Queue processing for background
- [ ] Write tests with sample images

## Tags

backend, image-processing, sharp

## Metadata

- **Created:** 2026-01-01T08:00:00Z
- **Updated:** 2026-01-01T08:00:00Z
