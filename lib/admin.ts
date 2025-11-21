import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getAdminUser() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return profile
}

export async function requireAdmin() {
  const profile = await getAdminUser()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'organizer')) {
    redirect('/dashboard')
  }

  return profile
}

export async function isAdmin(userId: string) {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', userId)
    .single()

  return profile?.role === 'admin' || profile?.role === 'organizer'
}
