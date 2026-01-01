# Development Workflow

This document explains how development progress is tracked using the Project Manager dashboard.

## Before Starting

1. **Start the project manager:**
   ```bash
   cd manager
   npm install  # First time only
   npm run dev
   ```

2. **Open the dashboard:**
   - Navigate to http://localhost:3002 in your browser
   - You'll see a Kanban board with all user stories

## How Development Works

### The AI Assistant Will:

1. **Move stories to "In Progress"**
   - When starting a feature, the story card moves to the "In Progress" column
   - You'll see exactly what's being worked on

2. **Implement features in the product/ codebase**
   - Code is written in `/product/` folder
   - All changes follow the acceptance criteria from the story

3. **Update technical tasks**
   - As each task completes, it gets checked off
   - You can click on any story to see detailed progress

4. **Move stories to "Review" then "Done"**
   - "Review": Code is ready for your inspection
   - "Done": Feature is complete and tested

### Your Role - Track Progress:

**Check the Dashboard Regularly:**
- 📊 **Stats at top**: See total stories, in progress count, completed count
- 📋 **Kanban Board**: Visual progress across all sprints
- 🔍 **Story Details**: Click any card to see full details
- 🏃 **Sprint Progress**: Filter by sprint to see sprint velocity

**Manage Priorities:**
- 🆕 **Add Stories**: Click "New Story" button to request features
- ✏️ **Edit Stories**: Drag cards between columns to change status
- 🎯 **Adjust Priority**: Change priority levels as needed
- 📅 **Plan Sprints**: Use sprint filter to organize work

## Quick Commands

The manager includes CLI tools for story management:

### Start Working on a Story
```bash
cd manager
./scripts/start-work.sh story-1
```

This moves the story to "In Progress" and displays a confirmation.

### Mark Story Complete
```bash
cd manager
./scripts/complete-work.sh story-1
```

This moves the story to "Done".

### Manual Status Update
```bash
cd manager
node scripts/update-story.js story-1 in-progress
node scripts/update-story.js story-1 review
node scripts/update-story.js story-1 done
```

## Story Lifecycle Example

### Story 1: Setup Database Schema

**Backlog → Todo:**
- Story created with acceptance criteria
- Prioritized as "critical"
- Added to Sprint 1

**Todo → In Progress:**
```bash
./scripts/start-work.sh story-1
```
- Story card moves to "In Progress" column
- Work begins on implementation

**During Implementation:**
- ✅ Review existing schema.prisma file
- ✅ Run prisma migrate dev to create database
- ✅ Update seed script with sample data
- ⬜ Test migration rollback
- ⬜ Document setup process

**In Progress → Review:**
- All technical tasks completed
- Code is ready for inspection
- You can review the changes

**Review → Done:**
```bash
./scripts/complete-work.sh story-1
```
- Story card moves to "Done" column
- Sprint progress updates
- Next story begins

## Understanding the Dashboard

### Epic Colors

Each epic has a distinct color for easy identification:

- 🔵 **Content Management** - Blue (#3B82F6)
- 🟢 **Media Library** - Green (#10B981)
- 🟠 **Page Builder** - Orange (#F59E0B)
- 🟣 **Social Media** - Purple (#8B5CF6)
- 💜 **Search & Elasticsearch** - Purple (#A855F7)
- 🔷 **Caching Layer** - Indigo (#6366F1)
- 💗 **Multi-tenancy** - Pink (#EC4899)
- 🔷 **Testing** - Cyan (#06B6D4)

### Priority Levels

Stories are color-coded by priority:

- 🔴 **Critical** - Red (must do immediately)
- 🟠 **High** - Orange (important)
- 🟡 **Medium** - Yellow (normal priority)
- 🔵 **Low** - Blue (nice to have)

### Status Columns

- **Backlog**: Not yet scheduled
- **To Do**: Ready to be worked on
- **In Progress**: Currently being implemented
- **Review**: Code complete, awaiting review
- **Done**: Fully complete and verified

### Story Card Information

Each card shows:
- Story title
- Priority badge
- Story ID (e.g., story-1)
- Time estimate (e.g., 8h, 2d)
- Tags (backend, api, database, etc.)
- Number of acceptance criteria
- Number of technical tasks

## Sprint Planning

### Current Sprint Structure

**Sprint 1 (Active)** - Foundation & Database
- 6 stories: Database setup, PostType, Post, PostMeta, Relations, Taxonomy
- Duration: Jan 6-19, 2026

**Sprint 2 (Planning)** - Media & Storage
- 4 stories: Storage setup, resumable uploads, image processing, media API
- Duration: Jan 20 - Feb 2, 2026

**Sprint 3-6**: Page Builder, Social Media, Search, Testing
- Planned for February-March 2026

### Tracking Sprint Progress

1. **Filter by Sprint**: Use the sprint dropdown to view sprint-specific stories
2. **Monitor Velocity**: See how many stories complete per sprint
3. **Adjust as Needed**: Move stories between sprints based on progress

## Benefits of This Workflow

✅ **Full Transparency**
- You always know what's being worked on
- No surprises about project status

✅ **Real-time Tracking**
- Dashboard updates immediately
- See progress as it happens

✅ **Easy Prioritization**
- Change priorities via drag-and-drop
- Add new stories anytime

✅ **Complete History**
- Audit trail of all work
- See when features were completed

✅ **Clear Communication**
- Acceptance criteria keep us aligned
- Technical tasks show exact implementation

## Getting Started - Next Steps

1. ✅ **Open the Manager**
   ```bash
   cd manager
   npm run dev
   ```
   Open http://localhost:3002

2. 📋 **Review the Stories**
   - Check Sprint 1 stories (Foundation & Database)
   - Review acceptance criteria
   - Add any missing requirements

3. 🚀 **Development Begins**
   - The AI assistant starts with story-1
   - Watch the dashboard for progress updates
   - Review completed work as stories move to "Done"

4. 💬 **Provide Feedback**
   - Add comments in stories
   - Adjust priorities as needed
   - Request new features

## Tips for Success

1. **Check Daily**: Open the manager once a day to see progress
2. **Review Details**: Click stories to see full acceptance criteria
3. **Add Context**: Edit stories to add clarifications
4. **Track Estimates**: Compare estimates vs actual time
5. **Celebrate Wins**: Watch the "Done" column grow! 🎉

## Troubleshooting

### Manager won't start?
```bash
cd manager
rm -rf node_modules
npm install
npm run dev
```

### Stories not showing?
- Check that `manager/data/stories.json` exists
- Refresh the browser (Ctrl+R or Cmd+R)

### Need to reset data?
- Backup current: `cp manager/data/stories.json manager/data/stories.backup.json`
- Restart the dev server

## Questions?

The manager is a tool to help you track progress. Use it however works best for you:
- Add stories for features you want
- Change priorities anytime
- Review work as it completes
- Stay informed about project status

Happy tracking! 🚀

