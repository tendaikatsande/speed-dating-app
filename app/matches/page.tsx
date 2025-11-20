import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, User, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getMatches(userId: string) {
  const supabase = await createClient()
  
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      profiles:user_id_2(*)
    `)
    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
    .eq('status', 'mutual')
    .order('created_at', { ascending: false })

  return matches || []
}

export default async function MatchesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const matches = await getMatches(user.id)

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
              {matches.map((match) => (
                <Card key={match.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">Match Name</CardTitle>
                        <CardDescription>Matched on Event</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">
                      You both showed interest in each other! Start a conversation.
                    </p>
                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pending Matches Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Interest</h2>
            <Card>
              <CardContent className="py-8 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  You have 0 pending interests from recent events
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
