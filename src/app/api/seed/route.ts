import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const demoUsers = [
      {
        name: "Ayesha Khan",
        email: "ayesha@example.com",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha",
        bio: "React and Next.js enthusiast. Love building clean, accessible UIs. Looking for a backend partner for a SaaS idea.",
        skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
        role: "FRONTEND",
        goal: "FIND_PARTNER",
        onboarded: true,
        githubUrl: "https://github.com",
        projects: {
          create: [
            {
              title: "Portfolio 2024",
              description: "A high-performance portfolio using Next.js 14 and Three.js.",
              techStack: ["React", "Next.js", "Three.js"]
            }
          ]
        }
      },
      {
        name: "Rahul Verma",
        email: "rahul@example.com",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
        bio: "Node.js Architect. Expert in PostgreSQL and Redis. I can build the fastest APIs you've ever seen.",
        skills: ["Node.js", "PostgreSQL", "Redis", "Docker"],
        role: "BACKEND",
        goal: "FIND_PARTNER",
        onboarded: true,
        githubUrl: "https://github.com",
        projects: {
          create: [
            {
              title: "Turbo API",
              description: "A distributed API gateway handling 100k req/s.",
              techStack: ["Node.js", "Redis", "Docker"]
            }
          ]
        }
      },
      {
        name: "Sofia Rodriguez",
        email: "sofia@example.com",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
        bio: "AI Engineer. Integrating LLMs into everyday applications. Let's build something experimental.",
        skills: ["Python", "PyTorch", "OpenAI", "FastAPI"],
        role: "BACKEND",
        goal: "MENTORSHIP",
        onboarded: true,
        githubUrl: "https://github.com",
        projects: {
          create: [
            {
              title: "Context Mind",
              description: "Smart note-taking app with RAG-based search.",
              techStack: ["Python", "OpenAI", "FastAPI"]
            }
          ]
        }
      }
    ]

    // Clear existing for clean seed
    await prisma.project.deleteMany({})
    await prisma.message.deleteMany({})
    await prisma.match.deleteMany({})
    await prisma.swipe.deleteMany({})

    for (const user of demoUsers) {
      const { projects, ...userData } = user
      const createdUser = await (prisma.user as any).upsert({
        where: { email: user.email },
        update: userData,
        create: userData,
      })

      if (projects?.create) {
        for (const project of projects.create) {
          await (prisma.project as any).create({
            data: {
              ...project,
              userId: createdUser.id
            }
          })
        }
      }
    }

    return NextResponse.json({ message: "Seeded 3 demo users successfully" })
  } catch (error) {
    console.error("Seed Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
