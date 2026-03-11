'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Github, MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import confetti from 'canvas-confetti'
import Link from 'next/link'

interface MatchModalProps {
  isOpen: boolean
  onClose: () => void
  user1: any // current user
  user2: any // matched user
  matchId?: string
}

export const MatchModal = ({ isOpen, onClose, user1, user2, matchId }: MatchModalProps) => {
  useEffect(() => {
    if (isOpen) {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 110 }

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
      }, 250)
      
      return () => clearInterval(interval)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Content Box */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg glass border border-white/10 rounded-[2.5rem] bg-gradient-to-b from-indigo-500/10 to-transparent p-8 md:p-12 overflow-hidden shadow-2xl shadow-indigo-500/20"
        >
          {/* Decorative Sparks */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
            <div className="absolute top-10 left-10 text-indigo-400 rotate-12"><Sparkles className="h-6 w-6" /></div>
            <div className="absolute bottom-10 right-10 text-purple-400 -rotate-12"><Sparkles className="h-4 w-4" /></div>
            <div className="absolute top-1/2 right-10 text-blue-400"><Sparkles className="h-5 w-5" /></div>
          </div>

          <div className="relative z-10 text-center flex flex-col items-center">
             <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-bold tracking-widest uppercase">
                It's a Match!
             </div>
             
             <h2 className="text-4xl md:text-5xl font-black text-white font-outfit mb-12 leading-tight">
                Start building <br />
                <span className="text-gradient">something epic.</span>
             </h2>

             {/* Avatars Cross */}
             <div className="flex items-center justify-center gap-4 mb-14 relative scale-110 md:scale-125">
                {/* User 1 */}
                <motion.div 
                   initial={{ x: -20, opacity: 0 }} 
                   animate={{ x: 0, opacity: 1 }}
                   transition={{ delay: 0.2 }}
                   className="relative"
                >
                   <div className="h-20 w-20 rounded-full border-2 border-indigo-500 ring-8 ring-indigo-500/5 overflow-hidden bg-black/40">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={user1?.image || ''} />
                        <AvatarFallback className="bg-indigo-900 text-white font-bold">{user1?.name?.[0]}</AvatarFallback>
                      </Avatar>
                   </div>
                </motion.div>

                {/* X Sign */}
                <motion.div 
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ delay: 0.4, type: "spring" }}
                   className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center"
                >
                   <X className="h-5 w-5 text-white/40" />
                </motion.div>

                {/* User 2 */}
                <motion.div 
                   initial={{ x: 20, opacity: 0 }} 
                   animate={{ x: 0, opacity: 1 }}
                   transition={{ delay: 0.2 }}
                   className="relative"
                >
                   <div className="h-20 w-20 rounded-full border-2 border-purple-500 ring-8 ring-purple-500/5 overflow-hidden bg-black/40">
                      <Avatar className="h-full w-full">
                         <AvatarImage src={user2?.image || ''} />
                         <AvatarFallback className="bg-purple-900 text-white font-bold">{user2?.name?.[0]}</AvatarFallback>
                      </Avatar>
                   </div>
                </motion.div>
             </div>

             <div className="w-full space-y-4 pt-4">
                <Button 
                   nativeButton={false}
                   render={
                    <Link href={`/matches/${matchId || ''}`} className="w-full h-14 bg-white text-slate-950 hover:bg-white/90 rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all">
                       <MessageCircle className="h-5 w-5 text-slate-950" />
                       <span className="text-slate-950">Send a message</span>
                       <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-slate-950" />
                    </Link>
                   }
                />
                
                <Button 
                   onClick={onClose}
                   variant="ghost"
                   className="w-full h-12 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-medium"
                >
                   Keep Swiping
                </Button>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
