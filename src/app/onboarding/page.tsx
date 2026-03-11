'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Rocket, Sparkles, Github, Loader2, ArrowRight, Check } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function OnboardingPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Welcome/Sync, 2: Role/Goal, 3: Verify
  const [syncing, setSyncing] = useState(false)
  const [onboardingData, setOnboardingData] = useState({
    skills: [] as string[],
    role: '',
    goal: '',
    bio: ''
  })

  // Prevent double loading
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
    // If already onboarded, maybe redirect? Skipping for now to allow testing.
  }, [status, router])

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch('/api/auth/sync', { method: 'POST' })
      const json = await res.json()
      if (json.success) {
        setOnboardingData(prev => ({
          ...prev,
          skills: json.data.skills,
          bio: json.data.bio
        }))
        setStep(2)
      } else {
        alert(json.error || "Failed to sync GitHub data")
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong during sync")
    } finally {
      setSyncing(false)
    }
  }

  const handleComplete = async () => {
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: onboardingData.role,
          goal: onboardingData.goal,
          onboarded: true
        })
      })
      if (res.ok) {
        await update() // Refresh session
        router.push('/discover')
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-indigo-500 h-10 w-10" /></div>
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 mesh-bg">
      <div className="w-full max-w-xl">
        {step === 1 && (
          <Card className="glass border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="text-center pt-10">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                 <Github className="text-indigo-400 h-8 w-8" />
              </div>
              <CardTitle className="text-3xl font-black text-white font-outfit">Welcome, {session?.user?.name}!</CardTitle>
              <p className="text-gray-400 mt-2">Let's power up your profile with your GitHub data.</p>
            </CardHeader>
            <CardContent className="space-y-6 px-10 pb-10">
              <div className="space-y-4">
                {[
                  "Sync your top repositories and skills automatically.",
                  "Help us match you with the right developers.",
                  "Get verified as an active GitHub contributor."
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-indigo-400" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-white/5 p-8 flex flex-col gap-4">
              <Button 
                onClick={handleSync} 
                disabled={syncing}
                className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20"
              >
                {syncing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Working Magic...</> : "Sync with GitHub 🚀"}
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card className="glass border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold font-outfit">What's your goal?</CardTitle>
              <p className="text-gray-400">Choose how you want to collaborate.</p>
            </CardHeader>
            <CardContent className="space-y-8 px-10">
              {/* Role Selection */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-indigo-300 uppercase tracking-widest">Main Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {['FRONTEND', 'BACKEND', 'FULLSTACK', 'MOBILE', 'DESIGNER'].map(r => (
                    <button
                      key={r}
                      onClick={() => setOnboardingData(prev => ({ ...prev, role: r }))}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        onboardingData.role === r 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      {r.charAt(0) + r.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Selection */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-indigo-300 uppercase tracking-widest">Your Focus</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'FIND_PARTNER', label: 'Looking for a Partner', desc: 'Find someone to build a product with.' },
                    { id: 'MENTORSHIP', label: 'Mentorship', desc: 'Share knowledge or learn from others.' },
                    { id: 'DREAM_TEAM', label: 'Build a Dream Team', desc: 'Recruit devs for your innovative team.' }
                  ].map(g => (
                    <button
                      key={g.id}
                      onClick={() => setOnboardingData(prev => ({ ...prev, goal: g.id }))}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        onboardingData.goal === g.id 
                        ? 'bg-indigo-900/30 border-indigo-500/50' 
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-bold ${onboardingData.goal === g.id ? 'text-indigo-300' : 'text-white'}`}>{g.label}</span>
                        {onboardingData.goal === g.id && <Sparkles className="h-4 w-4 text-indigo-400" />}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{g.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-8">
              <Button 
                onClick={() => setStep(3)} 
                disabled={!onboardingData.role || !onboardingData.goal}
                className="w-full h-12 bg-white text-black hover:bg-gray-200 font-bold rounded-xl"
              >
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card className="glass border-white/10 shadow-2xl p-4">
             <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold font-outfit">Ready to Launch!</CardTitle>
                <p className="text-gray-400">Review your AI-generated profile.</p>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                   <div className="flex flex-wrap gap-2">
                      {onboardingData.skills.map(s => <Badge key={s} className="bg-indigo-500/20 text-indigo-300 border-none">{s}</Badge>)}
                   </div>
                   <p className="text-sm text-gray-300 italic">"{onboardingData.bio}"</p>
                   <div className="flex gap-4 text-xs font-semibold">
                      <span className="text-indigo-400 uppercase">{onboardingData.role}</span>
                      <span className="text-gray-600">|</span>
                      <span className="text-gray-400">{onboardingData.goal.replace('_', ' ')}</span>
                   </div>
                </div>
             </CardContent>
             <CardFooter className="flex flex-col gap-3">
                <Button onClick={handleComplete} className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl">
                   Start Swiping! 🚀
                </Button>
                <Button variant="ghost" onClick={() => setStep(2)} className="text-gray-500 hover:text-white">
                   Go Back
                </Button>
             </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
