'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Code2, Users, Rocket, ExternalLink, Search, Filter, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const fetchProjects = async () => {
  const res = await fetch('/api/projects')
  if (!res.ok) throw new Error('Failed to fetch projects')
  return res.json()
}

const applyForProject = async (data: { projectId: string, ownerId: string, projectTitle: string }) => {
  const res = await fetch('/api/projects/apply', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
  if (!res.ok) throw new Error('Failed to apply')
  return res.json()
}

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [filterTech, setFilterTech] = useState<string | null>(null)
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  })

  // Get unique tech stacks for filters
  const allTech = Array.from(new Set(projects?.flatMap((p: any) => p.techStack || []) || [])) as string[]

  const applyMutation = useMutation({
    mutationFn: applyForProject,
    onSuccess: (data) => {
      router.push(`/matches/${data.matchId}`)
    }
  })

  const filteredProjects = projects?.filter((p: any) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = !filterTech || p.techStack?.includes(filterTech)
    return matchesSearch && matchesFilter
  })

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-black"><Loader2 className="animate-spin text-indigo-500" /></div>

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
           <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2 font-outfit">Open Source <span className="text-gradient">Collabs</span></h1>
              <p className="text-gray-400 text-lg">Find the next big project to contribute to.</p>
           </div>
           
           <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                 <Input 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder="Search projects..." 
                   className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl focus:border-indigo-500/50" 
                 />
              </div>
              <Button 
                nativeButton={false} 
                render={
                 <Link href="/projects/new">
                   <Plus className="h-5 w-5 mr-2" />
                   Post Idea
                 </Link>
                }
                className="h-12 px-6 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
              />
           </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 overflow-x-auto">
           <Button 
             variant={!filterTech ? "default" : "outline"} 
             onClick={() => setFilterTech(null)}
             className={`rounded-full px-5 h-9 text-xs font-bold border-indigo-500/20 ${!filterTech ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
           >
             All Tech
           </Button>
           {allTech.map((tech) => (
              <Button 
                key={tech}
                variant={filterTech === tech ? "default" : "outline"}
                onClick={() => setFilterTech(tech)}
                className={`rounded-full px-5 h-9 text-xs font-bold border-indigo-500/20 ${filterTech === tech ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {tech}
              </Button>
           ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredProjects?.map((project: any) => (
              <Card key={project.id} className="group glass border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:border-indigo-500/30">
                 <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-white/10">
                             <AvatarImage src={project.user?.image} />
                             <AvatarFallback>{project.user?.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                             <p className="text-white font-bold text-sm leading-none">{project.user?.name}</p>
                             <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">{project.user?.role || 'Developer'}</p>
                          </div>
                       </div>
                       <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 font-bold bg-indigo-500/5 px-3 py-1">
                          New Idea
                       </Badge>
                    </div>
                    <CardTitle className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">{project.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-sm line-clamp-3 mt-4 leading-relaxed h-[4.5rem]">
                       {project.description}
                    </CardDescription>
                 </CardHeader>

                 <CardContent className="p-8 pt-4 pb-4">
                    <div className="flex flex-wrap gap-2 mt-4">
                       {project.techStack?.map((tech: string) => (
                          <span key={tech} className="text-[10px] font-bold uppercase tracking-wider text-indigo-100/50 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                             {tech}
                          </span>
                       ))}
                    </div>
                 </CardContent>

                 <CardFooter className="p-8 pt-4 flex flex-col gap-4">
                    <div className="h-px w-full bg-white/5 mb-2" />
                    <Button 
                      onClick={() => applyMutation.mutate({ projectId: project.id, ownerId: project.userId, projectTitle: project.title })}
                      disabled={applyMutation.isPending && applyMutation.variables?.projectId === project.id}
                      className="w-full h-14 bg-white text-slate-950 hover:bg-white/90 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group/btn"
                    >
                       {applyMutation.isPending && applyMutation.variables?.projectId === project.id ? (
                         <Loader2 className="animate-spin h-5 w-5" />
                       ) : (
                         <>
                           Apply to Collaborate
                           <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                         </>
                       )}
                    </Button>
                 </CardFooter>
              </Card>
           ))}
        </div>
        
        {filteredProjects?.length === 0 && (
           <div className="text-center py-32 glass rounded-[3rem] border-dashed border-white/10">
              <Rocket className="h-20 w-20 text-white/5 mx-auto mb-8 animate-pulse" />
              <h2 className="text-3xl font-bold text-white mb-4">No projects found.</h2>
              <p className="text-gray-500 text-lg mb-10">Be the first to post a groundbreaking idea!</p>
              <Button 
                nativeButton={false} 
                render={<Link href="/projects/new">Post Idea</Link>}
                className="h-14 px-10 bg-indigo-600 hover:bg-indigo-500 rounded-2xl"
              />
           </div>
        )}
      </div>
    </div>
  )
}
