'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Heart, User, ArrowLeft, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Navigation from '@/components/navigation'

const INTEREST_OPTIONS = [
  'Travel', 'Music', 'Movies', 'Cooking', 'Fitness', 'Reading',
  'Gaming', 'Art', 'Photography', 'Dancing', 'Hiking', 'Sports',
  'Technology', 'Fashion', 'Food', 'Yoga', 'Pets', 'Nature'
]

const LOOKING_FOR_OPTIONS = [
  'Serious Relationship', 'Casual Dating', 'Friendship', 'Marriage',
  'Someone Active', 'Someone Creative', 'Someone Ambitious'
]

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Other']

export default function ProfileEditPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    location: '',
    bio: '',
    interests: [] as string[],
    looking_for: [] as string[],
  })

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profile) {
        setFormData({
          full_name: profile.full_name || '',
          date_of_birth: profile.date_of_birth || '',
          gender: profile.gender || '',
          location: profile.location || '',
          bio: profile.bio || '',
          interests: profile.interests || [],
          looking_for: profile.looking_for || [],
        })
      } else {
        router.push('/profile/setup')
      }
      setLoading(false)
    }

    loadProfile()
  }, [supabase, router])

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          location: formData.location || null,
          bio: formData.bio || null,
          interests: formData.interests,
          looking_for: formData.looking_for,
        })
        .eq('user_id', user.id)

      if (updateError) {
        setError(updateError.message)
      } else {
        setSuccess('Profile updated successfully!')
        setTimeout(() => router.push('/profile'), 1500)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 flex items-center justify-center">
          <div className="text-gray-600">Loading profile...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/profile">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {GENDER_OPTIONS.map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.gender === gender
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>About You</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell potential matches about yourself..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <p className="text-sm text-gray-600 mt-2">
                  {formData.bio.length}/500 characters
                </p>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        interests: toggleArrayItem(formData.interests, interest)
                      })}
                      className={`px-4 py-2 rounded-full border-2 transition-all ${
                        formData.interests.includes(interest)
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Looking For */}
            <Card>
              <CardHeader>
                <CardTitle>Looking For</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {LOOKING_FOR_OPTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        looking_for: toggleArrayItem(formData.looking_for, item)
                      })}
                      className={`px-4 py-2 rounded-full border-2 transition-all ${
                        formData.looking_for.includes(item)
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
