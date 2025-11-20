import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Calendar, MapPin, Heart, Edit } from 'lucide-react'
import Link from 'next/link'
import { calculateAge } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function getProfile(userId: string) {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  return profile
}

async function getProfileStats(userId: string) {
  const supabase = await createClient()

  // Get events attended count
  const { count: eventsCount } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get matches count
  const { count: matchesCount } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
    .eq('status', 'mutual')

  // Get messages count
  const { count: messagesCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('sender_id', userId)

  return {
    events: eventsCount || 0,
    matches: matchesCount || 0,
    messages: messagesCount || 0
  }
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await getProfile(user.id)

  if (!profile) {
    redirect('/profile/setup')
  }

  const age = calculateAge(profile.date_of_birth)
  const stats = await getProfileStats(user.id)

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 h-32" />
            
            <CardContent className="relative px-6 pb-6">
              {/* Avatar */}
              <div className="absolute -top-16 left-6">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex justify-end pt-4">
                <Link href="/profile/edit">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>

              {/* Profile Info */}
              <div className="mt-4">
                <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
                <p className="text-gray-600 text-lg">{age} years old • {profile.gender}</p>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">About Me</h2>
                  <p className="text-gray-700">{profile.bio}</p>
                </div>
              )}

              {/* Location */}
              {profile.location && (
                <div className="mt-6 flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{profile.location}</span>
                </div>
              )}

              {/* Interests */}
              {profile.interests && profile.interests.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest: string, index: number) => (
                      <span
                        key={index}
                        className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Looking For */}
              {profile.looking_for && profile.looking_for.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Looking For</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.looking_for.map((item: string, index: number) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Events Attended</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-rose-600">{stats.events}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-pink-600">{stats.matches}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">{stats.messages}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
