import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, User, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { calculateAge } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface MatchProfile {
  id: string
  full_name: string
  avatar_url: string | null
  date_of_birth: string
  gender: string
  bio: string | null
}

interface Match {
  id: string
  event_id: string
  user_id_1: string
  user_id_2: string
  status: string
  created_at: string
  profile_1: MatchProfile
  profile_2: MatchProfile
  event: {
    title: string
  }
}

async function getMatches(userId: string) {
  const supabase = await createClient()

  // Get matches where user is either user_id_1 or user_id_2
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      profile_1:profiles!matches_user_id_1_fkey(*),
      profile_2:profiles!matches_user_id_2_fkey(*),
      event:events(title)
    `)
    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
    .eq('status', 'mutual')
    .order('created_at', { ascending: false })

  return (matches || []) as Match[]
}

async function getPendingInterests(userId: string) {
  const supabase = await createClient()

  // Get pending matches where the other user expressed interest
  const { data: pending } = await supabase
    .from('matches')
    .select('*')
    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
    .eq('status', 'pending')

  return pending?.length || 0
}

export default async function MatchesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const matches = await getMatches(user.id)
  const pendingCount = await getPendingInterests(user.id)

  // Helper to get the other person's profile
  const getMatchedProfile = (match: Match) => {
    return match.user_id_1 === user.id ? match.profile_2 : match.profile_1
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Heart className="h-8 w-8 text-rose-600" fill="currentColor" />
              <h1 className="text-3xl font-bold text-gray-900">Your Matches</h1>
            </div>
            <p className="text-gray-600">Connect with people you&apos;ve matched with</p>
          </div>

          {/* Matches Grid */}
          {matches.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches yet</h3>
                <p className="text-gray-600 mb-6">
                  Attend events to meet new people and create matches!
                </p>
                <Link href="/dashboard">
                  <Button>Browse Events</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => {
                const profile = getMatchedProfile(match)
                const age = profile?.date_of_birth ? calculateAge(profile.date_of_birth) : null

                return (
                  <Card key={match.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center overflow-hidden">
                          {profile?.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt={profile.full_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-8 w-8 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">
                            {profile?.full_name || 'Unknown'}
                          </CardTitle>
                          <CardDescription>
                            {age && `${age} years old`}
                            {age && profile?.gender && ' • '}
                            {profile?.gender}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {profile?.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {profile.bio}
                        </p>
                      )}
                      {match.event && (
                        <p className="text-xs text-gray-500">
                          Matched at: {match.event.title}
                        </p>
                      )}
                      <div className="flex space-x-2">
                        <Link href={`/messages?match=${match.id}`} className="flex-1">
                          <Button className="w-full" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Pending Matches Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Interest</h2>
            <Card>
              <CardContent className="py-8 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  You have {pendingCount} pending interests from recent events
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
