import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Navigation from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, Clock, DollarSign, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function getEvent(id: string) {
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  return event
}

async function getUserRegistration(userId: string, eventId: string) {
  const supabase = await createClient()

  const { data: registration } = await supabase
    .from('registrations')
    .select('*')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .single()

  return registration
}

async function registerForEvent(userId: string, eventId: string) {
  'use server'

  const supabase = await createClient()

  const { error } = await supabase
    .from('registrations')
    .insert({
      user_id: userId,
      event_id: eventId,
      status: 'registered'
    })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

async function cancelRegistration(userId: string, eventId: string) {
  'use server'

  const supabase = await createClient()

  const { error } = await supabase
    .from('registrations')
    .delete()
    .eq('user_id', userId)
    .eq('event_id', eventId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const event = await getEvent(id)

  if (!event) {
    notFound()
  }

  const registration = await getUserRegistration(user.id, event.id)
  const isRegistered = !!registration
  const isFull = event.registered_count >= event.capacity

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>

          {/* Event Header */}
          <Card className="overflow-hidden border-0 shadow-lg">
            {/* Event Image/Banner */}
            <div className="h-64 bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10" />
              <Calendar className="h-24 w-24 text-white/30" />
            </div>

            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-3 text-gray-900">{event.title}</CardTitle>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    {event.description}
                  </CardDescription>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${
                    event.status === 'upcoming' ? 'bg-emerald-100 text-emerald-700' :
                    event.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                    event.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-indigo-100 p-2.5 rounded-lg">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-indigo-100 p-2.5 rounded-lg">
                    <Clock className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Time</p>
                    <p className="font-semibold text-gray-900">{formatTime(event.time)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-indigo-100 p-2.5 rounded-lg">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-indigo-100 p-2.5 rounded-lg">
                    <DollarSign className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Price</p>
                    <p className="font-semibold text-gray-900">
                      {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Capacity */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="font-semibold text-gray-900">Capacity</span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    {event.registered_count} / {event.capacity} registered
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      isFull ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{
                      width: `${Math.min((event.registered_count / event.capacity) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Registration Action */}
              <div className="pt-4 border-t border-gray-100">
                {isRegistered ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 p-4 rounded-xl">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">You&apos;re registered for this event!</span>
                    </div>
                    <form action={async () => {
                      'use server'
                      const supabase = await createClient()
                      const { data: { user } } = await supabase.auth.getUser()
                      if (user) {
                        await cancelRegistration(user.id, id)
                      }
                      redirect(`/events/${id}`)
                    }}>
                      <Button type="submit" variant="outline" className="w-full">
                        Cancel Registration
                      </Button>
                    </form>
                  </div>
                ) : event.status !== 'upcoming' ? (
                  <Button disabled className="w-full">
                    Event {event.status}
                  </Button>
                ) : isFull ? (
                  <Button disabled className="w-full">
                    Event Full
                  </Button>
                ) : (
                  <form action={async () => {
                    'use server'
                    const supabase = await createClient()
                    const { data: { user } } = await supabase.auth.getUser()
                    if (user) {
                      await registerForEvent(user.id, id)
                    }
                    redirect(`/events/${id}`)
                  }}>
                    <Button type="submit" className="w-full" size="lg">
                      Register for Event
                      {event.price > 0 && ` - $${event.price.toFixed(2)}`}
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
