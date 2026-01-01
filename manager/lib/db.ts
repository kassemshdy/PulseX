import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data/stories.json');

export interface Epic {
  id: string;
  name: string;
  description: string;
  color: string;
  status: 'active' | 'completed' | 'archived';
}

export interface Story {
  id: string;
  epicId: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimate: string;
  assignee: string | null;
  tags: string[];
  acceptanceCriteria: string[];
  technicalTasks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  storyIds: string[];
  status: 'planning' | 'active' | 'completed';
}

export interface Database {
  epics: Epic[];
  stories: Story[];
  sprints: Sprint[];
}

export async function readDB(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with empty data
    const emptyDB: Database = { epics: [], stories: [], sprints: [] };
    await writeDB(emptyDB);
    return emptyDB;
  }
}

export async function writeDB(data: Database): Promise<void> {
  // Ensure directory exists
  const dir = path.dirname(DB_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function getStories(filters?: {
  epicId?: string;
  status?: string;
  sprintId?: string;
}): Promise<Story[]> {
  const db = await readDB();
  let stories = db.stories;

  if (filters?.epicId) {
    stories = stories.filter((s) => s.epicId === filters.epicId);
  }
  if (filters?.status) {
    stories = stories.filter((s) => s.status === filters.status);
  }
  if (filters?.sprintId) {
    const sprint = db.sprints.find((sp) => sp.id === filters.sprintId);
    if (sprint) {
      stories = stories.filter((s) => sprint.storyIds.includes(s.id));
    }
  }

  return stories;
}

export async function getStory(id: string): Promise<Story | undefined> {
  const db = await readDB();
  return db.stories.find((s) => s.id === id);
}

export async function createStory(story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>): Promise<Story> {
  const db = await readDB();
  const newStory: Story = {
    id: `story-${Date.now()}`,
    ...story,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.stories.push(newStory);
  await writeDB(db);
  return newStory;
}

export async function updateStory(id: string, updates: Partial<Story>): Promise<Story | null> {
  const db = await readDB();
  const storyIndex = db.stories.findIndex((s) => s.id === id);

  if (storyIndex === -1) {
    return null;
  }

  db.stories[storyIndex] = {
    ...db.stories[storyIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await writeDB(db);
  return db.stories[storyIndex]!;
}

export async function updateStoryStatus(id: string, status: Story['status']): Promise<Story | null> {
  return updateStory(id, { status });
}

export async function deleteStory(id: string): Promise<boolean> {
  const db = await readDB();
  const initialLength = db.stories.length;
  db.stories = db.stories.filter((s) => s.id !== id);

  if (db.stories.length === initialLength) {
    return false;
  }

  await writeDB(db);
  return true;
}

export async function getEpics(): Promise<Epic[]> {
  const db = await readDB();
  return db.epics;
}

export async function getEpic(id: string): Promise<Epic | undefined> {
  const db = await readDB();
  return db.epics.find((e) => e.id === id);
}

export async function getSprints(): Promise<Sprint[]> {
  const db = await readDB();
  return db.sprints;
}

export async function getSprint(id: string): Promise<Sprint | undefined> {
  const db = await readDB();
  return db.sprints.find((s) => s.id === id);
}

export async function addStoryToSprint(storyId: string, sprintId: string): Promise<boolean> {
  const db = await readDB();
  const sprint = db.sprints.find((s) => s.id === sprintId);

  if (!sprint || sprint.storyIds.includes(storyId)) {
    return false;
  }

  sprint.storyIds.push(storyId);
  await writeDB(db);
  return true;
}

export async function removeStoryFromSprint(storyId: string, sprintId: string): Promise<boolean> {
  const db = await readDB();
  const sprint = db.sprints.find((s) => s.id === sprintId);

  if (!sprint) {
    return false;
  }

  sprint.storyIds = sprint.storyIds.filter((id) => id !== storyId);
  await writeDB(db);
  return true;
}

