import { NextRequest, NextResponse } from 'next/server';
import { getSprints } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sprints = await getSprints();
    return NextResponse.json(sprints);
  } catch (error) {
    console.error('Error fetching sprints:', error);
    return NextResponse.json({ error: 'Failed to fetch sprints' }, { status: 500 });
  }
}

