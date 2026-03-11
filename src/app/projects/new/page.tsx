'use client'

import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Rocket, Loader2, Github, LayoutGrid, CheckCircle2, BadgePlus, X, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const createProject = async (data: any) => {
  const res = await fetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
  if (!res.ok) throw new Error('Failed to create project')
  return res.json()
}

export default function NewProjectPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [tech, setTech] = useState('')
  const [techStack, setTechStack] = useState<string[]>([])
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      router.push('/projects')
    }
  })

  const addTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tech.trim()) {
      e.preventDefault()
      if (!techStack.includes(tech.trim())) {
        setTechStack([...techStack, tech.trim()])
      }
      setTech('')
    }
  }

  const removeTech = (t: string) => {
    setTechStack(techStack.filter(item => item !== t))
  }

  const handleCreate = () => {
    if (!title || !description) return
    mutation.mutate({ title, description, githubUrl, techStack })
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-6 sm:px-10 font-outfit">
      <div className="max-w-4xl mx-auto">
        <Link href="/projects">
          <Button variant="ghost" className="mb-10 text-gray-400 hover:text-white group -ml-4">
            <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-16">
           <div className="p-4 rounded-3xl bg-indigo-600/20 border border-indigo-500/20">
              <BadgePlus className="h-8 w-8 text-indigo-400" />
           </div>
           <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Build <span className="text-gradient">Something </span>Epic.</h1>
              <p className="text-gray-400 text-lg">Describe your idea and find the dream team to execute it.</p>
           </div>
        </div>

        <div className="space-y-12 glass p-10 md:p-16 rounded-[3rem] border-white/5 relative overflow-hidden">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 p-10 opacity-10">
              <Code2 className="h-40 w-40 text-indigo-500" />
           </div>

           <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-indigo-400 ml-1">Project Title</label>
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 'Eco-Swipe (Tinder for Sustainability)'" 
                className="h-16 bg-white/5 border-white/10 rounded-2xl text-xl font-bold px-8 focus:border-indigo-500 transition-all"
              />
           </div>

           <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-indigo-400 ml-1">The Vision (Description)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are we building? Who do we need? What's the impact?"
                className="w-full min-h-[200px] bg-white/5 border-white/10 rounded-[2.5rem] p-10 text-lg font-medium text-white focus:border-indigo-500 transition-all outline-none border resize-none"
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-indigo-400 ml-1">GitHub Repo (Optional)</label>
                 <div className="relative">
                    <Github className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input 
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..." 
                      className="h-16 bg-white/5 border-white/10 rounded-2xl pl-16 px-8 focus:border-indigo-500 transition-all"
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-sm font-black uppercase tracking-widest text-indigo-400 ml-1">Tech Stack (Enter tags)</label>
                 <Input 
                   value={tech}
                   onChange={(e) => setTech(e.target.value)}
                   onKeyDown={addTech}
                   placeholder="React, Node.js, AI, etc." 
                   className="h-16 bg-white/5 border-white/10 rounded-2xl px-8 focus:border-indigo-500 transition-all"
                 />
                 <div className="flex flex-wrap gap-2 mt-4 ml-1">
                    {techStack.map(t => (
                       <Badge key={t} className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-bold border-indigo-500/20 px-4 py-1.5 h-auto flex items-center gap-2">
                          {t}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeTech(t)} />
                       </Badge>
                    ))}
                 </div>
              </div>
           </div>

           <div className="h-px w-full bg-white/5 pt-8" />

           <Button 
            onClick={handleCreate}
            disabled={mutation.isPending || !title || !description}
            className="w-full h-18 bg-white text-slate-950 hover:bg-indigo-50 hover:scale-[1.01] rounded-3xl text-2xl font-black transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-4 group"
           >
              {mutation.isPending ? <Loader2 className="animate-spin h-8 w-8" /> : (
                <>
                  Blast it to the Moon 🚀
                  <CheckCircle2 className="h-7 w-7 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-110 transition-all" />
                </>
              )}
           </Button>
        </div>
      </div>
    </div>
  )
}
