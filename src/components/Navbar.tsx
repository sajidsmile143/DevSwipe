'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Menu, X, Code2, Github, User, Briefcase, LogOut, Settings, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePathname } from 'next/navigation'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasNewMatch, setHasNewMatch] = useState(false)
  const [myMatchIds, setMyMatchIds] = useState<string[]>([])
  const matchIdsRef = useRef<string[]>([])
  const pathname = usePathname()
  const { data: session, status } = useSession()

  // Update ref whenever state changes
  useEffect(() => {
    matchIdsRef.current = myMatchIds
  }, [myMatchIds])

  useEffect(() => {
    if (!session?.user?.id) return

    const myId = session.user.id
    console.log("Navbar: Basic Realtime Listener active for myId:", myId)

    // Manual Test: Run testNotify() in browser console to verify UI
    ;(window as any).testNotify = () => {
      console.log("UI Test: Showing red dot")
      setHasNewMatch(true)
    }

    const channel = supabase
      .channel('any-new-msg')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          console.log("!!! REALTIME MESSAGE RECEIVED !!!", payload)
          // Just show the dot for ANY new message for now to confirm it works
          setHasNewMatch(true)
        }
      )
      .subscribe((status) => {
        console.log("📡 Supabase Status:", status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session?.user?.id])

  // Clear notification when visiting matches page
  useEffect(() => {
    if (pathname === '/matches' || pathname.startsWith('/matches/')) {
      setHasNewMatch(false)
    }
  }, [pathname])

  const navLinks = [
    { name: 'Discover', href: '/discover', icon: Briefcase },
    { name: 'Projects', href: '/projects', icon: Code2 },
    { name: 'Matches', href: '/matches', icon: MessageCircle },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-lg bg-indigo-600 p-1.5 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                <Github className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white focus:outline-none">
                Dev<span className="text-indigo-500">Swipe</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center space-x-2 text-gray-300 hover:text-white transition-colors py-2 px-1 relative",
                    pathname === link.href && "text-white font-semibold"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                  {link.name === 'Matches' && hasNewMatch && (
                    <span className="absolute -top-1 -right-2 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </span>
                  )}
                </Link>
              ))}

              <div className="ml-4 flex items-center space-x-4">
                {status === 'authenticated' ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-offset-black transition-all hover:ring-2 hover:ring-indigo-500/50">
                          <Avatar className="h-9 w-9 border border-white/10">
                            <AvatarImage src={session.user?.image || ''} alt={session.user?.name || 'User'} />
                            <AvatarFallback className="bg-indigo-900/50 text-indigo-200">
                              {session.user?.name?.[0] || <User className="h-4 w-4" />}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      }
                    />
                    <DropdownMenuContent className="w-56 border-white/10 bg-black/90 backdrop-blur-xl text-gray-200" align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none text-white">{session.user?.name}</p>
                            <p className="text-xs leading-none text-gray-400">{session.user?.email}</p>
                          </div>
                        </DropdownMenuLabel>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          render={
                            <Link href="/profile" className="cursor-pointer flex items-center w-full">
                              <User className="mr-2 h-4 w-4" />
                              <span>Profile</span>
                            </Link>
                          }
                        />
                        <DropdownMenuItem
                          render={
                            <Link href="/settings" className="cursor-pointer flex items-center w-full">
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Settings</span>
                            </Link>
                          }
                        />
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem 
                        onClick={() => signOut()}
                        className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-400/10"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    onClick={() => signIn('github')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all active:scale-95"
                  >
                    Get Started
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 px-2 pb-3 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 rounded-md px-3 py-3 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
            >
              <link.icon className="h-5 w-5" />
              <span>{link.name}</span>
            </Link>
          ))}
          <div className="mt-4 px-3">
            {status === 'authenticated' ? (
              <Button onClick={() => signOut()} variant="destructive" className="w-full">
                Log Out
              </Button>
            ) : (
              <Button onClick={() => signIn('github')} className="w-full bg-indigo-600 hover:bg-indigo-500">
                Sign In with GitHub
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
