'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navigation from '@/components/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, Send, User, ArrowLeft } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Profile {
  id: string
  full_name: string
  avatar_url: string | null
}

interface Message {
  id: string
  match_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
}

interface Conversation {
  match_id: string
  other_user: Profile
  last_message: Message | null
  unread_count: number
}

function MessagesContent() {
  const searchParams = useSearchParams()
  const initialMatchId = searchParams.get('match')

  const [supabase] = useState(() => createClient())
  const [userId, setUserId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedMatch, setSelectedMatch] = useState<string | null>(initialMatchId)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUser()
  }, [supabase])

  // Load conversations
  useEffect(() => {
    if (!userId) return

    const loadConversations = async () => {
      // Get all mutual matches
      const { data: matches } = await supabase
        .from('matches')
        .select(`
          id,
          user_id_1,
          user_id_2,
          profile_1:profiles!matches_user_id_1_fkey(id, full_name, avatar_url),
          profile_2:profiles!matches_user_id_2_fkey(id, full_name, avatar_url)
        `)
        .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
        .eq('status', 'mutual')

      if (!matches) {
        setLoading(false)
        return
      }

      // Build conversations with last message
      const convos: Conversation[] = await Promise.all(
        matches.map(async (match: any) => {
          const otherUser = match.user_id_1 === userId ? match.profile_2 : match.profile_1

          // Get last message
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('*')
            .eq('match_id', match.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          // Get unread count
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('match_id', match.id)
            .neq('sender_id', userId)
            .eq('read', false)

          return {
            match_id: match.id,
            other_user: otherUser,
            last_message: lastMsg || null,
            unread_count: count || 0
          }
        })
      )

      // Sort by last message time
      convos.sort((a, b) => {
        if (!a.last_message) return 1
        if (!b.last_message) return -1
        return new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime()
      })

      setConversations(convos)
      setLoading(false)

      // If initial match provided, set selected profile
      if (initialMatchId) {
        const convo = convos.find(c => c.match_id === initialMatchId)
        if (convo) {
          setSelectedProfile(convo.other_user)
        }
      }
    }

    loadConversations()
  }, [userId, supabase, initialMatchId])

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedMatch || !userId) return

    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', selectedMatch)
        .order('created_at', { ascending: true })

      setMessages(data || [])

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('match_id', selectedMatch)
        .neq('sender_id', userId)
        .eq('read', false)

      // Update unread count in conversations
      setConversations(prev =>
        prev.map(c =>
          c.match_id === selectedMatch ? { ...c, unread_count: 0 } : c
        )
      )
    }

    loadMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${selectedMatch}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${selectedMatch}`
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages(prev => [...prev, newMsg])

          // Mark as read if not from current user
          if (newMsg.sender_id !== userId) {
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMsg.id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedMatch, userId, supabase])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSelectConversation = (matchId: string, profile: Profile) => {
    setSelectedMatch(matchId)
    setSelectedProfile(profile)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedMatch || !userId) return

    setSending(true)

    const { error } = await supabase
      .from('messages')
      .insert({
        match_id: selectedMatch,
        sender_id: userId,
        content: newMessage.trim()
      })

    if (!error) {
      setNewMessage('')

      // Update last message in conversations
      setConversations(prev =>
        prev.map(c =>
          c.match_id === selectedMatch
            ? {
                ...c,
                last_message: {
                  id: 'temp',
                  match_id: selectedMatch,
                  sender_id: userId,
                  content: newMessage.trim(),
                  read: false,
                  created_at: new Date().toISOString()
                }
              }
            : c
        )
      )
    }

    setSending(false)
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 flex items-center justify-center">
          <div className="text-gray-600">Loading conversations...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <MessageCircle className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            </div>
            <p className="text-gray-600">Chat with your matches</p>
          </div>

          {/* Messages Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className={`lg:col-span-1 ${selectedMatch ? 'hidden lg:block' : ''}`}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversations</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {conversations.length === 0 ? (
                    <div className="py-8 text-center px-4">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No conversations yet</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Match with people to start chatting!
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {conversations.map((convo) => (
                        <button
                          key={convo.match_id}
                          onClick={() => handleSelectConversation(convo.match_id, convo.other_user)}
                          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                            selectedMatch === convo.match_id ? 'bg-indigo-50' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 flex items-center justify-center flex-shrink-0">
                              {convo.other_user.avatar_url ? (
                                <img
                                  src={convo.other_user.avatar_url}
                                  alt={convo.other_user.full_name}
                                  className="h-full w-full rounded-full object-cover"
                                />
                              ) : (
                                <User className="h-6 w-6 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900 truncate">
                                  {convo.other_user.full_name}
                                </p>
                                {convo.unread_count > 0 && (
                                  <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                                    {convo.unread_count}
                                  </span>
                                )}
                              </div>
                              {convo.last_message && (
                                <p className="text-sm text-gray-600 truncate">
                                  {convo.last_message.sender_id === userId ? 'You: ' : ''}
                                  {convo.last_message.content}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className={`lg:col-span-2 ${!selectedMatch ? 'hidden lg:block' : ''}`}>
              <Card className="h-[600px] flex flex-col">
                {selectedMatch && selectedProfile ? (
                  <>
                    {/* Chat Header */}
                    <CardHeader className="border-b flex-shrink-0">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            setSelectedMatch(null)
                            setSelectedProfile(null)
                          }}
                          className="lg:hidden p-1 hover:bg-gray-100 rounded"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 flex items-center justify-center">
                          {selectedProfile.avatar_url ? (
                            <img
                              src={selectedProfile.avatar_url}
                              alt={selectedProfile.full_name}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <CardTitle className="text-lg">{selectedProfile.full_name}</CardTitle>
                      </div>
                    </CardHeader>

                    {/* Messages */}
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-gray-600">No messages yet. Say hello!</p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                message.sender_id === userId
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender_id === userId ? 'text-indigo-200' : 'text-gray-600'
                              }`}>
                                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </CardContent>

                    {/* Message Input */}
                    <div className="border-t p-4 flex-shrink-0">
                      <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          disabled={sending}
                          className="flex-1"
                        />
                        <Button type="submit" disabled={sending || !newMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <CardContent className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Select a conversation
                      </h3>
                      <p className="text-gray-600">
                        Choose a match from the left to start messaging
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 flex items-center justify-center">
          <div className="text-gray-600">Loading messages...</div>
        </div>
      </>
    }>
      <MessagesContent />
    </Suspense>
  )
}
