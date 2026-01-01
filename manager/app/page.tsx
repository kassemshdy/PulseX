'use client';

import { useState, useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';
import EpicFilter from './components/EpicFilter';
import SprintSelector from './components/SprintSelector';
import StoryForm from './components/StoryForm';
import { Story, Epic, Sprint } from '@/lib/db';
import { Plus, RefreshCw } from 'lucide-react';

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [filters, setFilters] = useState<{ epicId: string | null; sprintId: string | null }>({
    epicId: null,
    sprintId: null,
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.epicId) params.set('epicId', filters.epicId);
      if (filters.sprintId) params.set('sprintId', filters.sprintId);

      const [storiesRes, epicsRes, sprintsRes] = await Promise.all([
        fetch(`/api/stories?${params}`),
        fetch('/api/epics'),
        fetch('/api/sprints'),
      ]);

      const [storiesData, epicsData, sprintsData] = await Promise.all([
        storiesRes.json(),
        epicsRes.json(),
        sprintsRes.json(),
      ]);

      setStories(storiesData);
      setEpics(epicsData);
      setSprints(sprintsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const totalStories = stories.length;
  const completedStories = stories.filter((s) => s.status === 'done').length;
  const inProgressStories = stories.filter((s) => s.status === 'in-progress').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Manager</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage user stories, track progress, and plan sprints
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{totalStories}</div>
                <div className="text-gray-500">Total</div>
              </div>
              <div className="text-center px-4 py-2 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-900">{inProgressStories}</div>
                <div className="text-yellow-700">In Progress</div>
              </div>
              <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{completedStories}</div>
                <div className="text-green-700">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <EpicFilter
            epics={epics}
            value={filters.epicId}
            onChange={(epicId) => setFilters({ ...filters, epicId })}
          />
          <SprintSelector
            sprints={sprints}
            value={filters.sprintId}
            onChange={(sprintId) => setFilters({ ...filters, sprintId })}
          />

          <div className="flex-1" />

          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Story
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <KanbanBoard stories={stories} onUpdate={fetchData} />
        )}
      </div>

      {showForm && (
        <StoryForm
          epics={epics}
          onClose={() => setShowForm(false)}
          onSave={fetchData}
        />
      )}
    </div>
  );
}

