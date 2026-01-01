import { NextRequest, NextResponse } from 'next/server';
import { getStories, createStory } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const epicId = searchParams.get('epicId') || undefined;
    const status = searchParams.get('status') || undefined;
    const sprintId = searchParams.get('sprintId') || undefined;

    const stories = await getStories({ epicId, status, sprintId });

    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newStory = await createStory({
      epicId: body.epicId || '',
      title: body.title,
      description: body.description || '',
      status: body.status || 'backlog',
      priority: body.priority || 'medium',
      estimate: body.estimate || '',
      assignee: body.assignee || null,
      tags: body.tags || [],
      acceptanceCriteria: body.acceptanceCriteria || [],
      technicalTasks: body.technicalTasks || [],
    });

    return NextResponse.json(newStory, { status: 201 });
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 });
  }
}

