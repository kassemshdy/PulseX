# Story story-42: Implement Subdomain Routing

**Epic:** PulseX Platform
**Status:** todo
**Priority:** high
**Estimate:** 12h
**Assignee:** Unassigned

## Description

As the platform, I want to route subdomains to user sites, so that user1.pulsex.com shows user1's website.

## Acceptance Criteria

- [ ] Subdomains resolve to correct subscription
- [ ] Middleware identifies subscription from hostname
- [ ] Admin panel accessible at subdomain/admin
- [ ] Public site at subdomain root
- [ ] Wildcard SSL certificates work
- [ ] 404 for non-existent subdomains
- [ ] Support for custom domains later

## Technical Tasks

- [ ] Configure DNS wildcard (*.pulsex.com)
- [ ] Add subscription resolution middleware
- [ ] Update admin-api to handle subdomains
- [ ] Update front-api for subdomain routing
- [ ] Setup wildcard SSL certificates
- [ ] Add domain validation
- [ ] Test subdomain routing
- [ ] Document DNS setup

## Tags

infrastructure, routing, dns

## Metadata

- **Created:** 2026-01-01T13:00:00Z
- **Updated:** 2026-01-01T13:00:00Z
