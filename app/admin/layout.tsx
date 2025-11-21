import { requireAdmin } from '@/lib/admin'
import Link from 'next/link'
import { LayoutDashboard, Calendar, Users, ArrowLeft } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <nav className="p-4 space-y-2">
            <Link
              href="/admin"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/events"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <Calendar className="h-5 w-5" />
              <span>Events</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
            <hr className="my-4" />
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to App</span>
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
