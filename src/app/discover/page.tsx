'use client'

import React, { useState } from 'react'
import { SwipeCard } from '@/components/SwipeCard'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Sparkles, RefreshCcw, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession, signIn } from 'next-auth/react'

const fetchPotentials = async () => {
  const res = await fetch('/api/discover')
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

const swipeUser = async ({ targetUserId, type }: { targetUserId: string, type: 'LIKE' | 'REJECT' }) => {
  const res = await fetch('/api/swipe', {
    method: 'POST',
    body: JSON.stringify({ targetUserId, type }),
  })
  return res.json()
}

import { MatchModal } from '@/components/MatchModal'

export default function DiscoverPage() {
  const { data: session, status } = useSession()
  const queryClient = useQueryClient()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [matchedUser, setMatchedUser] = useState<any>(null)
  const [currentMatchId, setCurrentMatchId] = useState<string>('')

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['potentials'],
    queryFn: fetchPotentials,
    enabled: status === 'authenticated'
  })

  const mutation = useMutation({
    mutationFn: swipeUser,
    onSuccess: (data, variables) => {
      // onSuccess can be handled here or in mutate
    }
  })

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!users || !users[currentIndex]) return

    const targetUser = users[currentIndex]
    const type = direction === 'right' ? 'LIKE' : 'REJECT'
    
    mutation.mutate({ targetUserId: targetUser.id, type }, {
      onSuccess: (data) => {
        if (data.match) {
           setMatchedUser(targetUser)
           setCurrentMatchId(data.matchId)
           setShowMatchModal(true)
           // Hum index tab barhayen gy jab user modal band kare ga ya reject ho ga
        } else {
           setCurrentIndex((prev) => prev + 1)
        }
      },
      onError: () => {
         // Agar error aye to bhi next card pe jayen ta k flow na rukay
         setCurrentIndex((prev) => prev + 1)
      }
    })
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-6 text-center px-4">
        <div className="p-4 rounded-full bg-indigo-500/10 mb-2">
          <Github className="h-12 w-12 text-indigo-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white font-outfit">Join the community</h2>
          <p className="text-gray-400 max-w-sm mx-auto">You need to sign in with GitHub to start swiping and finding partners.</p>
        </div>
        <Button onClick={() => signIn('github')} size="lg" className="bg-indigo-600 hover:bg-indigo-500 px-8">
          Sign In with GitHub
        </Button>
      </div>
    )
  }

  if (isLoading || status === 'loading') {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
        <p className="text-gray-400 font-medium">Finding potential matches...</p>
      </div>
    )
  }

  const hasMore = users && currentIndex < users.length

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-4">
      <div className="relative h-[600px] w-full max-w-sm flex items-center justify-center">
        <AnimatePresence>
          {hasMore ? (
            <SwipeCard
              key={users[currentIndex].id}
              user={users[currentIndex]}
              onSwipe={handleSwipe}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="mx-auto w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-outfit">All caught up!</h3>
                <p className="text-gray-400 mt-2">Check back later for more developers.</p>
              </div>
              <Button 
                onClick={() => {
                  setCurrentIndex(0)
                  refetch()
                }} 
                variant="outline" 
                className="border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh List
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <MatchModal 
          isOpen={showMatchModal}
          onClose={() => {
            setShowMatchModal(false)
            setCurrentIndex((prev) => prev + 1)
          }}
          user1={session?.user}
          user2={matchedUser}
          matchId={currentMatchId}
        />
      </div>
    </div>
  )
}
