'use client';

import { Sprint } from '@/lib/db';
import { Calendar } from 'lucide-react';

interface SprintSelectorProps {
  sprints: Sprint[];
  value: string | null;
  onChange: (sprintId: string | null) => void;
}

export default function SprintSelector({ sprints, value, onChange }: SprintSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sprint-filter" className="text-sm font-medium text-gray-700 flex items-center gap-1">
        <Calendar className="w-4 h-4" />
        Sprint:
      </label>
      <select
        id="sprint-filter"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        <option value="">All Sprints</option>
        {sprints.map((sprint) => (
          <option key={sprint.id} value={sprint.id}>
            {sprint.name} ({sprint.status})
          </option>
        ))}
      </select>
    </div>
  );
}

