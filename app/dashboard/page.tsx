import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, Clock, Sparkles } from 'lucide-react'
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

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const events = await getEvents()

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Discover Your Perfect Match</h1>
            </div>
            <p className="text-rose-100 text-lg mb-6">
              Join exciting speed dating events and connect with amazing people
            </p>
            <Button size="lg" variant="secondary">
              Browse All Events
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-rose-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                    <p className="text-sm text-gray-600">Upcoming Events</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                    <p className="text-sm text-gray-600">Active Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">567</p>
                    <p className="text-sm text-gray-600">Matches Made</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events Grid */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-600">Check back soon for exciting speed dating events!</p>
              </div>
            ) : (
              events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  {event.image_url && (
                    <div className="h-48 bg-gradient-to-r from-rose-400 to-pink-400 rounded-t-lg" />
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {formatTime(event.time)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {event.registered_count} / {event.capacity} registered
                    </div>
                    <div className="pt-2">
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
