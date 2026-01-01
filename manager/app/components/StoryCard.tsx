'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';
import { Story } from '@/lib/db';
import { Clock, Tag } from 'lucide-react';

interface StoryCardProps {
  story: Story;
}

const priorityColors = {
  critical: 'border-l-red-500 bg-red-50',
  high: 'border-l-orange-500 bg-orange-50',
  medium: 'border-l-yellow-500 bg-yellow-50',
  low: 'border-l-blue-500 bg-blue-50',
};

const priorityBadgeColors = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
};

export default function StoryCard({ story }: StoryCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: story.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border-l-4 ${priorityColors[story.priority]} rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-move p-4`}
    >
      <Link href={`/stories/${story.id}`} className="block">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
            {story.title}
          </h3>
          <span
            className={`ml-2 px-2 py-0.5 text-xs font-medium rounded ${
              priorityBadgeColors[story.priority]
            }`}
          >
            {story.priority}
          </span>
        </div>

        {story.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{story.description}</p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-mono">{story.id}</span>
          {story.estimate && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{story.estimate}</span>
            </div>
          )}
        </div>

        {story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          {story.acceptanceCriteria && story.acceptanceCriteria.length > 0 && (
            <span>✓ {story.acceptanceCriteria.length} AC</span>
          )}
          {story.technicalTasks && story.technicalTasks.length > 0 && (
            <span>□ {story.technicalTasks.length} Tasks</span>
          )}
        </div>
      </Link>
    </div>
  );
}

