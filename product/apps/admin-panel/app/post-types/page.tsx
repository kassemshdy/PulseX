'use client';

import Link from 'next/link';
import { ArrowLeft, Plus, Database } from 'lucide-react';

export default function PostTypesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Post Types</h1>
              <p className="text-gray-600 mt-1">Define your content structures</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              <Plus className="w-5 h-5" />
              Create Post Type
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Post Types Yet</h2>
          <p className="text-gray-600 mb-6">Get started by creating your first post type</p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus className="w-5 h-5" />
            Create Your First Post Type
          </button>
        </div>
      </div>
    </div>
  );
}

