import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, Calendar, MessageCircle, Users, Sparkles, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-rose-600" fill="currentColor" />
              <span className="text-2xl font-bold text-gray-900">SpeedDate</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Heart className="h-20 w-20 text-rose-600 animate-pulse" fill="currentColor" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect Match
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join exciting speed dating events and connect with amazing people who share your interests
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Dating Now
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose SpeedDate?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-rose-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Exciting Events
            </h3>
            <p className="text-gray-600">
              Attend curated speed dating events in your area
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Smart Matching
            </h3>
            <p className="text-gray-600">
              Our algorithm finds compatible matches based on your preferences
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Real-time Chat
            </h3>
            <p className="text-gray-600">
              Connect instantly with your matches through our chat feature
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Active Community
            </h3>
            <p className="text-gray-600">
              Join thousands of singles looking for meaningful connections
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-rose-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Create Your Profile
            </h3>
            <p className="text-gray-600">
              Sign up and tell us about yourself and what you&apos;re looking for
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-rose-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Join an Event
            </h3>
            <p className="text-gray-600">
              Browse and register for speed dating events in your city
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-rose-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Meet & Connect
            </h3>
            <p className="text-gray-600">
              Match with people you like and start chatting instantly
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Find Your Match?
          </h2>
          <p className="text-xl text-rose-100 mb-8">
            Join thousands of singles who have found love through SpeedDate
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Sign Up Now - It&apos;s Free!
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-rose-600" fill="currentColor" />
              <span className="text-xl font-bold text-gray-900">SpeedDate</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2024 SpeedDate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
