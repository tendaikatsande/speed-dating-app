'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Heart, User, Calendar, MapPin, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

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

export default function ProfileSetupPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    location: '',
    bio: '',
    interests: [] as string[],
    looking_for: [] as string[],
  })

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          location: formData.location || null,
          bio: formData.bio || null,
          interests: formData.interests,
          looking_for: formData.looking_for,
        })

      if (profileError) {
        if (profileError.code === '23505') {
          // Profile already exists, update instead
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
            return
          }
        } else {
          setError(profileError.message)
          return
        }
      }

      router.push('/dashboard')
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.full_name && formData.date_of_birth && formData.gender
      case 2:
        return formData.interests.length >= 3
      case 3:
        return formData.looking_for.length >= 1
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-violet-50 to-purple-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Heart className="h-12 w-12 text-indigo-600 mb-4" fill="currentColor" />
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Step {step} of 4</p>

          {/* Progress bar */}
          <div className="w-full max-w-xs mt-4 bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
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
                    placeholder="Your full name"
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
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-gray-600 mt-1">Must be 18 or older</p>
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
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Your Interests
                </CardTitle>
                <CardDescription>Select at least 3 interests</CardDescription>
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
                <p className="text-sm text-gray-600 mt-4">
                  Selected: {formData.interests.length}/3 minimum
                </p>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Looking For */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  What are you looking for?
                </CardTitle>
                <CardDescription>Select what matters to you</CardDescription>
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
          )}

          {/* Step 4: Bio */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  About You
                </CardTitle>
                <CardDescription>Write a short bio (optional)</CardDescription>
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
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Continue
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating Profile...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
