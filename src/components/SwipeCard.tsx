'use client'

import React, { useState } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Github, Code, Heart, X, Sparkles, MapPin } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
}

interface User {
  id: string
  name: string
  email: string
  image: string
  bio: string
  skills: string[]
  githubUrl: string
  projects: Project[]
}

interface SwipeCardProps {
  user: User
  onSwipe: (direction: 'left' | 'right') => void
}

export const SwipeCard = ({ user, onSwipe }: SwipeCardProps) => {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])
  const heartOpacity = useTransform(x, [50, 150], [0, 1])
  const xOpacity = useTransform(x, [-50, -150], [0, 1])

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('right')
    } else if (info.offset.x < -100) {
      onSwipe('left')
    }
  }

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute cursor-grab active:cursor-grabbing w-full max-w-sm"
    >
      <Card className="overflow-hidden border-white/10 bg-zinc-900/90 shadow-2xl backdrop-blur-xl">
        {/* Visual Feedback Overlays */}
        <motion.div 
          style={{ opacity: heartOpacity }}
          className="absolute top-6 right-6 z-20 pointer-events-none"
        >
          <div className="rounded-full bg-green-500/20 p-4 border-2 border-green-500/50">
            <Heart className="h-12 w-12 text-green-500 fill-green-500" />
          </div>
        </motion.div>

        <motion.div 
          style={{ opacity: xOpacity }}
          className="absolute top-6 left-6 z-20 pointer-events-none"
        >
          <div className="rounded-full bg-red-500/20 p-4 border-2 border-red-500/50">
            <X className="h-12 w-12 text-red-500" />
          </div>
        </motion.div>

        <CardHeader className="relative p-0 pt-6 flex flex-col items-center">
           <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-sm opacity-50" />
              <Avatar className="h-32 w-32 border-2 border-white/10 ring-4 ring-black/50 relative">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="bg-zinc-800 text-3xl font-bold">
                  {user.name?.[0]}
                </AvatarFallback>
              </Avatar>
           </div>
           
           <div className="mt-4 text-center">
              <h2 className="text-2xl font-bold text-white font-outfit">{user.name}</h2>
              <div className="flex items-center justify-center text-gray-400 text-sm mt-1">
                <Code className="h-3 w-3 mr-1" />
                <span>Full-Stack Developer</span>
              </div>
           </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          <p className="text-gray-300 text-sm leading-relaxed text-center px-4">
            {user.bio || "No bio provided yet. Just a mysterious dev ready to build amazing things."}
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            {user.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20">
                {skill}
              </Badge>
            ))}
          </div>

          {user.projects.length > 0 && (
            <div className="bg-black/40 rounded-xl p-4 border border-white/5 mx-2">
              <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <Sparkles className="h-3 w-3 mr-1 text-yellow-500" />
                Main project
              </div>
              <h3 className="text-white font-medium text-sm">{user.projects[0].title}</h3>
              <p className="text-gray-400 text-xs mt-1 line-clamp-2">{user.projects[0].description}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-around pb-8 pt-2">
          <Button 
            variant="outline" 
            size="lg" 
            className="rounded-full h-14 w-14 border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 active:scale-90"
            onClick={() => onSwipe('left')}
          >
            <X className="h-6 w-6" />
          </Button>

          <Button 
            className="rounded-full h-14 w-14 bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all transform hover:scale-110 active:scale-90"
            onClick={() => {}} // Placeholder for match logic if needed separately
          >
            <Github className="h-6 w-6" />
          </Button>

          <Button 
            variant="outline" 
            size="lg" 
            className="rounded-full h-14 w-14 border-green-500/20 bg-green-500/5 text-green-500 hover:bg-green-500 hover:text-white transition-all transform hover:scale-110 active:scale-90"
            onClick={() => onSwipe('right')}
          >
            <Heart className="h-6 w-6" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
