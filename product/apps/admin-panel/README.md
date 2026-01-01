# PulseX Admin Panel

The administrative dashboard for managing your PulseX CMS content.

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
DATABASE_URL='postgresql://cms_user:cms_password@localhost:5432/cms_db?schema=public' pnpm dev
```

The admin panel will be available at **http://localhost:3000**

## Features

- **Dashboard**: Overview of your content and analytics
- **Post Types**: Define custom content structures
- **Posts**: Create and manage content
- **Media**: Upload and organize files
- **Pages**: Build pages with visual editor
- **Users**: Manage team members and roles
- **Settings**: Configure your site

## Access

After signing up on the marketing site (http://localhost:3003), you'll be automatically redirected to the admin panel.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- @cms/services (Business logic)
- @cms/database (Prisma Client)

## File Structure

```
admin-panel/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard home
│   ├── post-types/         # Post type management
│   ├── posts/              # Content management
│   ├── media/              # Media library
│   ├── pages/              # Page builder
│   ├── users/              # User management
│   ├── analytics/          # Analytics dashboard
│   └── settings/           # Settings panel
├── components/             # Reusable UI components
├── lib/                    # Utility functions
└── public/                 # Static assets
```

## Development

### Adding New Pages

1. Create a new folder in `app/` directory
2. Add a `page.tsx` file
3. Update navigation in dashboard

### Styling

Uses Tailwind CSS. Global styles are in `app/globals.css`.

Primary color: `#6366f1` (Indigo)
Secondary color: `#8b5cf6` (Purple)

## Building for Production

```bash
pnpm build
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment (development/production)

