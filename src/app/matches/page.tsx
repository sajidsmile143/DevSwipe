'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Loader2, MessageCircle, Github, ArrowRight, User, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const fetchMatches = async () => {
  const res = await fetch('/api/matches')
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default function MatchesPage() {
  const { status } = useSession()
  const { data: matches, isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    enabled: status === 'authenticated'
  })

  if (status === 'unauthenticated') {
    return <div className="p-20 text-center">Please sign in to view matches.</div>
  }

  if (isLoading || status === 'loading') {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
        <p className="text-gray-400">Loading your matches...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-6 md:p-12 mesh-bg">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-2xl">
            <MessageCircle className="h-8 w-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white font-outfit">Your Matches</h1>
            <p className="text-gray-400 mt-1">Connect with developers who liked you back.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {matches?.length === 0 ? (
             <Card className="glass border-white/5 border-dashed bg-transparent p-20 text-center">
                <p className="text-gray-500 text-lg mb-6 italic">"The best code is the one we write together."</p>
                <p className="text-gray-400">No matches yet. Keep swiping to find your team!</p>
                <Button nativeButton={false} render={<Link href="/discover" className="mt-8 bg-indigo-600 hover:bg-indigo-500 text-white">Find Partners</Link>} />
             </Card>
          ) : (
            matches?.map((match: any) => (
              <Card key={match.id} className="glass hover:bg-white/5 border-white/10 transition-all group overflow-hidden">
                <Link href={`/matches/${match.id}`} className="block">
                  <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                       <Avatar className="h-20 w-20 border-2 border-indigo-500/20">
                         <AvatarImage src={match.partner.image} />
                         <AvatarFallback>{match.partner.name?.[0]}</AvatarFallback>
                       </Avatar>
                       <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-4 border-black ring-1 ring-white/10" title="Online" />
                    </div>

                    <div className="flex-1 space-y-1 text-center md:text-left">
                       <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors tracking-tight font-outfit">{match.partner.name}</h3>
                          <Badge variant="outline" className="w-fit mx-auto md:mx-0 border-indigo-500/30 text-indigo-300 text-[10px] py-0 px-2 uppercase tracking-widest">{match.partner.role}</Badge>
                       </div>
                       <p className="text-sm text-white/40 line-clamp-1 italic">"{match.lastMessage}"</p>
                    </div>

                    <div className="flex items-center gap-2">
                       <div className="hidden md:flex flex-col items-end gap-1 text-right mr-4">
                          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">Matched on</span>
                          <span className="text-xs text-gray-400">{new Date(match.createdAt).toLocaleDateString()}</span>
                       </div>
                       <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                          <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                       </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
