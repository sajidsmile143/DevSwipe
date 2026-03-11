import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    const currentUserId = session?.user?.id

    const projects = await (prisma.project as any).findMany({
      where: {
        userId: {
          not: currentUserId
        }
      },
      include: {
        user: {
          select: { id: true, name: true, image: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Fetch Projects Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { title, description, techStack, githubUrl } = await req.json()

    if (!title || !description) return NextResponse.json({ error: "Title and description required" }, { status: 400 })

    const project = await (prisma.project as any).create({
      data: {
        title,
        description,
        techStack: techStack || [],
        githubUrl,
        userId: session.user.id
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Create Project Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
