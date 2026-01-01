import { notFound } from 'next/navigation';
import { getStory, getEpic } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, Clock, Tag, CheckCircle2, ListTodo } from 'lucide-react';

const priorityColors = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-blue-100 text-blue-800 border-blue-200',
};

const statusColors = {
  backlog: 'bg-gray-100 text-gray-800',
  todo: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  review: 'bg-purple-100 text-purple-800',
  done: 'bg-green-100 text-green-800',
};

export default async function StoryDetailPage({ params }: { params: { id: string } }) {
  const story = await getStory(params.id);

  if (!story) {
    notFound();
  }

  const epic = await getEpic(story.epicId);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Board
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm text-gray-500">{story.id}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      priorityColors[story.priority]
                    }`}
                  >
                    {story.priority.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[story.status]}`}>
                    {story.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{story.title}</h1>
                {epic && (
                  <div className="inline-flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: epic.color }}
                    />
                    <span className="text-gray-600">
                      Epic: <strong>{epic.name}</strong>
                    </span>
                  </div>
                )}
              </div>
              {story.estimate && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold text-gray-900">{story.estimate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {story.description && (
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{story.description}</p>
            </div>
          )}

          {/* Acceptance Criteria */}
          {story.acceptanceCriteria && story.acceptanceCriteria.length > 0 && (
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Acceptance Criteria</h2>
              </div>
              <ul className="space-y-2">
                {story.acceptanceCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 text-xs flex items-center justify-center font-medium mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 flex-1">{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical Tasks */}
          {story.technicalTasks && story.technicalTasks.length > 0 && (
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ListTodo className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Technical Tasks</h2>
              </div>
              <ul className="space-y-2">
                {story.technicalTasks.map((task, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 flex-1 font-mono text-sm">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-gray-50 p-6 rounded-b-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(story.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Updated:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(story.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

