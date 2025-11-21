import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, Clock, Sparkles, TrendingUp, Heart } from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function getEvents() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'upcoming')
    .order('date', { ascending: true })
    .limit(12)

  return events || []
}

async function getStats() {
  const supabase = await createClient()

  // Get active members count
  const { count: membersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Get mutual matches count
  const { count: matchesCount } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'mutual')

  return {
    members: membersCount || 0,
    matches: matchesCount || 0
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const events = await getEvents()
  const stats = await getStats()

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Discover Your Perfect Match</h1>
              </div>
              <p className="text-indigo-100 text-lg mb-6 max-w-xl">
                Join exciting speed dating events and connect with amazing people
              </p>
              <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-indigo-50">
                Browse All Events
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-100 p-3 rounded-xl">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{events.length}</p>
                    <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-violet-100 p-3 rounded-xl">
                    <Users className="h-6 w-6 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{stats.members.toLocaleString()}</p>
                    <p className="text-sm font-medium text-gray-600">Active Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-xl">
                    <Heart className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{stats.matches.toLocaleString()}</p>
                    <p className="text-sm font-medium text-gray-600">Matches Made</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events Grid */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
            <p className="text-gray-600">Find your next opportunity to connect</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-600">Check back soon for exciting speed dating events!</p>
              </div>
            ) : (
              events.map((event) => (
                <Card key={event.id} className="group border-0 shadow-md hover:shadow-xl transition-all duration-300">
                  {/* Event Header with gradient */}
                  <div className="h-32 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-t-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    <Calendar className="h-12 w-12 text-white/80" />
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-gray-600">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="flex items-center text-sm text-gray-700">
                      <Calendar className="h-4 w-4 mr-3 text-indigo-500" />
                      <span className="font-medium">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Clock className="h-4 w-4 mr-3 text-indigo-500" />
                      <span className="font-medium">{formatTime(event.time)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin className="h-4 w-4 mr-3 text-indigo-500" />
                      <span className="font-medium truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Users className="h-4 w-4 mr-3 text-indigo-500" />
                      <span className="font-medium">{event.registered_count} / {event.capacity} registered</span>
                    </div>

                    {/* Capacity progress bar */}
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          event.registered_count >= event.capacity
                            ? 'bg-amber-500'
                            : 'bg-indigo-500'
                        }`}
                        style={{
                          width: `${Math.min((event.registered_count / event.capacity) * 100, 100)}%`
                        }}
                      />
                    </div>

                    <div className="pt-3">
                      <Link href={`/events/${event.id}`}>
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
