import { requireAdmin } from '@/lib/admin'
import Link from 'next/link'
import { LayoutDashboard, Calendar, Users, Heart, ArrowRightLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <LayoutDashboard className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Admin</h2>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <Link
              href="/admin"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/events"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              <Calendar className="h-5 w-5" />
              <span>Events</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
          </nav>

          {/* Switch to Dating Area */}
          <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-200 bg-white">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full justify-start">
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Switch to Dating
              </Button>
            </Link>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Go to your dating profile
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 pb-24">
          {children}
        </main>
      </div>
    </div>
  )
}
