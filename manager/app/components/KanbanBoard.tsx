'use client';

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import StoryCard from './StoryCard';
import { Story } from '@/lib/db';

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-100' },
  { id: 'todo', title: 'To Do', color: 'bg-blue-50' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-50' },
  { id: 'review', title: 'Review', color: 'bg-purple-50' },
  { id: 'done', title: 'Done', color: 'bg-green-50' },
];

interface KanbanBoardProps {
  stories: Story[];
  onUpdate: () => void;
}

export default function KanbanBoard({ stories, onUpdate }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeStory = stories.find((s) => s.id === activeId);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const storyId = active.id as string;
    const newStatus = over.id as Story['status'];

    // Update story status via API
    try {
      await fetch(`/api/stories/${storyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      onUpdate();
    } catch (error) {
      console.error('Failed to update story status:', error);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => {
          const columnStories = stories.filter((s) => s.status === column.id);

          return (
            <div key={column.id} className="flex-1 min-w-[320px]">
              <div className={`${column.color} rounded-t-lg px-4 py-3 border-b-2 border-gray-200`}>
                <h2 className="font-bold text-gray-700">
                  {column.title}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({columnStories.length})
                  </span>
                </h2>
              </div>

              <SortableContext
                items={columnStories.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
                id={column.id}
              >
                <div className="bg-white min-h-[200px] p-2 space-y-2">
                  {columnStories.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeStory ? (
          <div className="rotate-3 opacity-80">
            <StoryCard story={activeStory} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

