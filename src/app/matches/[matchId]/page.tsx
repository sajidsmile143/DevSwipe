'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Loader2, Send, ChevronLeft, Github, Rocket, MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const fetchMessages = async (matchId: string) => {
  const res = await fetch(`/api/matches/${matchId}/messages`)
  if (!res.ok) throw new Error('Failed to fetch messages')
  return res.json()
}

const sendMessage = async ({ matchId, text }: { matchId: string, text: string }) => {
  const res = await fetch(`/api/matches/${matchId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ text }),
    headers: { 'Content-Type': 'application/json' }
  })
  return res.json()
}

export default function ChatPage() {
  const { matchId } = useParams() as { matchId: string }
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [inputText, setInputText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', matchId],
    queryFn: () => fetchMessages(matchId),
    enabled: !!matchId && !!session
  })

  const { data: matches } = useQuery({ queryKey: ['matches'], queryFn: () => fetch('/api/matches').then(r => r.json()) })
  const matchInfo = matches?.find((m: any) => m.id === matchId)

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setInputText('')
      queryClient.invalidateQueries({ queryKey: ['messages', matchId] })
    }
  })

  useEffect(() => {
    if (!matchId) return

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`match:${matchId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `matchId=eq.${matchId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', matchId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId, queryClient])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!inputText.trim()) return
    mutation.mutate({ matchId: matchId as string, text: inputText })
  }

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-black"><Loader2 className="animate-spin text-indigo-500" /></div>

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-black">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 glass">
        <div className="flex items-center gap-4">
          <Link href="/matches">
            <Button variant="ghost" size="icon" className="hover:bg-white/5"><ChevronLeft className="h-6 w-6 text-gray-400" /></Button>
          </Link>
          <div className="flex items-center gap-3">
             <Avatar className="h-10 w-10 border border-indigo-500/20">
               <AvatarImage src={matchInfo?.partner?.image} />
               <AvatarFallback>{matchInfo?.partner?.name?.[0]}</AvatarFallback>
             </Avatar>
             <div>
               <h2 className="font-bold text-white line-clamp-1">{matchInfo?.partner?.name || 'Partner'}</h2>
               <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{matchInfo?.partner?.role || 'Developer'}</span>
               </div>
             </div>
          </div>
        </div>
        <Button variant="outline" className="hidden md:flex gap-2 border-indigo-500/20 text-indigo-300">
           <Github className="h-4 w-4" />
           View Repo
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages?.map((msg: any) => {
          const isMe = msg.senderId === session?.user?.id
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${
                 isMe 
                 ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/10' 
                 : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
               }`}>
                  {msg.text}
                  <div className={`text-[10px] mt-1 opacity-50 ${isMe ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
               </div>
            </div>
          )
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/10 glass">
        <div className="max-w-4xl mx-auto flex gap-3">
           <Input 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             onKeyPress={(e) => e.key === 'Enter' && handleSend()}
             placeholder="Discuss the next big thing..."
             className="flex-1 h-14 bg-white/5 border-white/10 rounded-xl px-6 focus:border-indigo-500/50 transition-all"
           />
           <Button 
             onClick={handleSend}
             disabled={mutation.isPending || !inputText.trim()}
             className="h-14 w-14 bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20"
           >
             {mutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
           </Button>
        </div>
      </div>
    </div>
  )
}
