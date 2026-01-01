'use client';

import { Epic } from '@/lib/db';

interface EpicFilterProps {
  epics: Epic[];
  value: string | null;
  onChange: (epicId: string | null) => void;
}

export default function EpicFilter({ epics, value, onChange }: EpicFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="epic-filter" className="text-sm font-medium text-gray-700">
        Epic:
      </label>
      <select
        id="epic-filter"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        <option value="">All Epics</option>
        {epics.map((epic) => (
          <option key={epic.id} value={epic.id}>
            {epic.name}
          </option>
        ))}
      </select>
    </div>
  );
}

