'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Settings, 
  Users,
  Database,
  Globe,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // TODO: Get user from cookies/session
    // For now, show a welcome screen
  }, []);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/',
      description: 'Overview and analytics',
    },
    {
      title: 'Post Types',
      icon: Database,
      href: '/post-types',
      description: 'Manage content structures',
    },
    {
      title: 'Posts',
      icon: FileText,
      href: '/posts',
      description: 'Create and manage content',
    },
    {
      title: 'Media',
      icon: Image,
      href: '/media',
      description: 'Upload and manage files',
    },
    {
      title: 'Pages',
      icon: Globe,
      href: '/pages',
      description: 'Build pages with visual editor',
    },
    {
      title: 'Users',
      icon: Users,
      href: '/users',
      description: 'Manage team members',
    },
    {
      title: 'Analytics',
      icon: Activity,
      href: '/analytics',
      description: 'View site performance',
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/settings',
      description: 'Configure your site',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PulseX Admin</h1>
                <p className="text-sm text-gray-600">Content Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome back!</span>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Admin Panel
          </h2>
          <p className="text-gray-600 text-lg">
            Manage your content, configure post types, and build beautiful pages.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Posts', value: '0', color: 'bg-blue-500' },
            { label: 'Media Files', value: '0', color: 'bg-green-500' },
            { label: 'Pages', value: '0', color: 'bg-purple-500' },
            { label: 'Users', value: '1', color: 'bg-orange-500' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-primary group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </Link>
            );
          })}
        </div>

        {/* Getting Started */}
        <div className="mt-12 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold mb-2">1</div>
              <h4 className="font-semibold mb-2">Create Post Types</h4>
              <p className="text-white/80 text-sm">
                Define your content structure - articles, products, portfolios, anything!
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">2</div>
              <h4 className="font-semibold mb-2">Add Content</h4>
              <p className="text-white/80 text-sm">
                Create posts, upload media, and organize your content library.
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">3</div>
              <h4 className="font-semibold mb-2">Build Pages</h4>
              <p className="text-white/80 text-sm">
                Use the visual page builder to create stunning pages without code.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

