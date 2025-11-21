import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, Calendar, MessageCircle, Users, Sparkles, Star, Shield, Zap, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-indigo-600" fill="currentColor" />
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
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
          <div className="absolute top-40 -left-40 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Over 10,000 successful matches
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Find Your
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"> Perfect Match</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Join curated speed dating events and connect with amazing people who share your interests. Real connections, in real time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 h-14">
                  Start Dating Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                  Browse Events
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 border-2 border-white" />
                  ))}
                </div>
                <span>5,000+ active members</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                ))}
                <span className="ml-1">4.9 rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose SpeedDate?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;ve designed the perfect platform for meaningful connections
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-indigo-100 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
              <Calendar className="h-7 w-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Exciting Events
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Attend curated speed dating events designed for genuine connections
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-violet-100 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
              <Zap className="h-7 w-7 text-violet-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Smart Matching
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our algorithm finds compatible matches based on your unique preferences
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
              <MessageCircle className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Real-time Chat
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Connect instantly with your matches through secure messaging
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-emerald-100 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
              <Shield className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Safe & Verified
            </h3>
            <p className="text-gray-600 leading-relaxed">
              All members are verified for a safe and trustworthy experience
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Three simple steps to finding your perfect match
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative text-center">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-indigo-200">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Create Your Profile
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Sign up and tell us about yourself, your interests, and what you&apos;re looking for in a partner
              </p>
            </div>
            <div className="relative text-center">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-indigo-200">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Join an Event
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Browse and register for speed dating events that match your schedule and preferences
              </p>
            </div>
            <div className="relative text-center">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-indigo-200">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Meet & Connect
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Match with people you like and start meaningful conversations instantly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Match?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of singles who have found meaningful connections through SpeedDate
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 h-14 bg-white text-indigo-600 hover:bg-indigo-50">
                Sign Up Now - It&apos;s Free!
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-indigo-600" fill="currentColor" />
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
