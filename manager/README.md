# CMS Project Manager

A local project management dashboard built with Next.js to track user stories, epics, and sprints for the CMS project.

## Features

- 📋 **Kanban Board** - Drag-and-drop stories between columns (Backlog → To Do → In Progress → Review → Done)
- 📊 **Epic Organization** - Filter stories by epic with color-coded visuals
- 🏃 **Sprint Planning** - Organize stories into sprints and track progress
- 🎯 **Priority Management** - Visual indicators for Critical/High/Medium/Low priorities
- ⏱️ **Time Estimates** - Track estimated time per story
- 🏷️ **Tags** - Categorize stories (backend, frontend, api, etc.)
- ✅ **Acceptance Criteria** - Track what needs to be done
- 🔧 **Technical Tasks** - Detailed implementation checklist
- 📝 **Story Details** - Full view with all story information

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **dnd-kit** - Drag and drop functionality
- **JSON File** - Simple file-based database (no setup required)

## Getting Started

### 1. Install Dependencies

```bash
cd manager
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) to view the project manager.

### 3. Data Storage

Stories are stored in `../product/data/stories.json`. The file is automatically created if it doesn't exist.

## Usage

### Kanban Board

- **Drag & Drop**: Drag story cards between columns to update their status
- **Filter by Epic**: Use the Epic dropdown to view stories from a specific epic
- **Filter by Sprint**: Use the Sprint dropdown to view stories in a specific sprint
- **View Details**: Click on any story card to see full details

### Creating Stories

1. Click "New Story" button
2. Fill in:
   - **Title** (required) - Brief description starting with "As a [role]..."
   - **Description** - Detailed explanation
   - **Epic** (required) - Which epic this belongs to
   - **Priority** - Critical/High/Medium/Low
   - **Estimate** - Time estimate (e.g., "8h", "2d")
   - **Status** - Current status
   - **Tags** - Comma-separated tags
   - **Acceptance Criteria** - One per line, what makes this done
   - **Technical Tasks** - Implementation steps, one per line
3. Click "Save Story"

### Story Details Page

Click any story to view:
- Full description
- All acceptance criteria
- Technical task checklist
- Tags
- Metadata (created/updated dates)
- Epic information

## Data Structure

### Epic
- id, name, description, color, status

### Story
- id, epicId, title, description
- status (backlog/todo/in-progress/review/done)
- priority (critical/high/medium/low)
- estimate, assignee, tags
- acceptanceCriteria[], technicalTasks[]
- createdAt, updatedAt

### Sprint
- id, name, startDate, endDate
- storyIds[], status

## Customization

### Adding New Epics

Edit `../product/data/stories.json`:

```json
{
  "epics": [
    {
      "id": "epic-5",
      "name": "Your Epic Name",
      "description": "Description here",
      "color": "#FF6B6B",
      "status": "active"
    }
  ]
}
```

### Adding New Sprints

```json
{
  "sprints": [
    {
      "id": "sprint-3",
      "name": "Sprint 3 - Feature Name",
      "startDate": "2026-02-03",
      "endDate": "2026-02-16",
      "storyIds": [],
      "status": "planning"
    }
  ]
}
```

## Scripts

- `npm run dev` - Start development server (port 3002)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## File Structure

```
manager/
├── app/
│   ├── api/                  # API routes
│   │   ├── stories/          # Story CRUD endpoints
│   │   ├── epics/            # Epic endpoints
│   │   └── sprints/          # Sprint endpoints
│   ├── components/           # React components
│   │   ├── KanbanBoard.tsx   # Main board
│   │   ├── StoryCard.tsx     # Story card
│   │   ├── StoryForm.tsx     # Create/edit form
│   │   ├── EpicFilter.tsx    # Epic filter
│   │   └── SprintSelector.tsx
│   ├── stories/[id]/         # Story detail page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page (Kanban)
├── lib/
│   └── db.ts                 # JSON file database operations
└── package.json
```

## Tips

1. **Backup Your Data**: The `stories.json` file contains all your data. Back it up regularly!
2. **Epic Colors**: Use hex colors to visually distinguish epics
3. **Tags**: Use consistent tag names across stories for better organization
4. **Estimates**: Use consistent format (hours: "8h", days: "2d")
5. **Technical Tasks**: Be specific with implementation details

## Future Enhancements

Potential features to add:
- Story comments/activity log
- Velocity charts
- Burndown charts
- Team member assignment
- Time tracking
- Export to GitHub Issues
- Search functionality
- Bulk operations

## License

Part of the CMS project.

