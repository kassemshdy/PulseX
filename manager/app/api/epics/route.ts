import { NextRequest, NextResponse } from 'next/server';
import { getEpics } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const epics = await getEpics();
    return NextResponse.json(epics);
  } catch (error) {
    console.error('Error fetching epics:', error);
    return NextResponse.json({ error: 'Failed to fetch epics' }, { status: 500 });
  }
}

