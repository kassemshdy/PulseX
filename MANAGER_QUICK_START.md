# Project Manager - Quick Start Guide

Your local project management dashboard is ready! 🎉

## Location

The project manager is located at: `manager/` (at the root, next to the `product/` folder)

## Quick Start

```bash
# 1. Navigate to the manager folder
cd manager

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The project manager will be available at: **http://localhost:3002**

## What You'll See

### Kanban Board (Home Page)
- **5 Columns**: Backlog → To Do → In Progress → Review → Done
- **Drag & Drop**: Move stories between columns to update their status
- **Filters**: Filter by Epic or Sprint
- **Stats**: Total stories, in progress, and completed count
- **New Story Button**: Create new user stories

### Pre-loaded Data

The system comes with sample data including:
- **4 Epics**: Content Management, Media Library, Page Builder, Social Media Automation
- **5 User Stories**: Ready to track
- **2 Sprints**: Sprint 1 (active), Sprint 2 (planning)

### Story Cards

Each card shows:
- Title
- Priority badge (Critical/High/Medium/Low) with color coding
- Story ID
- Time estimate
- Tags
- Number of acceptance criteria and technical tasks

## Features

### 1. Create New Story
Click "New Story" to open the form:
- **Required**: Title, Epic
- **Optional**: Description, Priority, Estimate, Status, Tags, Acceptance Criteria, Technical Tasks

### 2. View Story Details
Click any story card to see:
- Full description
- All acceptance criteria (numbered list)
- Technical task checklist
- Tags
- Metadata (created/updated dates)

### 3. Update Story Status
Drag a story card from one column to another - it automatically saves!

### 4. Filter Stories
- **By Epic**: Use the Epic dropdown to focus on one epic
- **By Sprint**: Use the Sprint dropdown to view sprint-specific stories

## Data Storage

All data is stored in: `product/data/stories.json`

This is a simple JSON file that you can:
- Edit manually if needed
- Back up easily
- Version control with git

## File Structure

```
manager/
├── app/
│   ├── api/                    # API routes
│   │   ├── stories/            # CRUD for stories
│   │   ├── epics/              # Read epics
│   │   └── sprints/            # Read sprints
│   ├── components/             # React components
│   │   ├── KanbanBoard.tsx     # Main board with DnD
│   │   ├── StoryCard.tsx       # Story card component
│   │   ├── StoryForm.tsx       # Create/edit modal
│   │   ├── EpicFilter.tsx      # Epic dropdown
│   │   └── SprintSelector.tsx  # Sprint dropdown
│   ├── stories/[id]/           # Story detail page
│   │   └── page.tsx
│   ├── page.tsx                # Home (Kanban board)
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── lib/
│   └── db.ts                   # JSON database operations
├── package.json
├── tsconfig.json
└── README.md                   # Detailed documentation
```

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **@dnd-kit** - Drag and drop functionality
- **Lucide React** - Beautiful icons
- **JSON File** - Simple file-based database

## Tips

1. **Priority Colors**:
   - 🔴 Critical - Red
   - 🟠 High - Orange
   - 🟡 Medium - Yellow
   - 🔵 Low - Blue

2. **Epic Colors**: Edit `product/data/stories.json` to customize epic colors

3. **Estimates**: Use consistent format like "8h" (hours) or "2d" (days)

4. **Tags**: Use tags like `backend`, `frontend`, `api`, `ui`, `database` for categorization

5. **Acceptance Criteria**: Write clear, testable conditions

6. **Technical Tasks**: Be specific with implementation details

## Customization

### Add New Epic

Edit `product/data/stories.json`:

```json
{
  "epics": [
    {
      "id": "epic-6",
      "name": "Authentication",
      "description": "User login and authorization",
      "color": "#EC4899",
      "status": "active"
    }
  ]
}
```

### Add New Sprint

```json
{
  "sprints": [
    {
      "id": "sprint-3",
      "name": "Sprint 3 - Authentication",
      "startDate": "2026-02-03",
      "endDate": "2026-02-16",
      "storyIds": [],
      "status": "planning"
    }
  ]
}
```

## Workflow

### Recommended Workflow:

1. **Planning Phase**:
   - Create epics for major features
   - Break down epics into user stories
   - Write acceptance criteria
   - Add technical tasks
   - Estimate time
   - Set priority

2. **Sprint Planning**:
   - Assign stories to sprint
   - Move high-priority stories to "To Do"

3. **Development**:
   - Drag story to "In Progress" when you start
   - Check off technical tasks as you complete them
   - Update status as you progress

4. **Review**:
   - Move to "Review" when ready
   - Check acceptance criteria
   - Test functionality

5. **Done**:
   - Move to "Done" when all criteria met
   - Track velocity for future planning

## Troubleshooting

### Port 3002 already in use?

```bash
# Kill the process using port 3002
lsof -ti:3002 | xargs kill -9

# Or run on a different port
npm run dev -- -p 3003
```

### Data not loading?

Check that `product/data/stories.json` exists. If not, it will be auto-created on first API call.

### Drag and drop not working?

Make sure you're dragging from the card (not from links inside it) and dropping on a column.

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start the dev server: `npm run dev`
3. 📋 Open http://localhost:3002
4. 🎯 Create your first custom story
5. 🚀 Start tracking your CMS project progress!

## Support

For detailed documentation, see: `manager/README.md`

Enjoy managing your project! 🎉

