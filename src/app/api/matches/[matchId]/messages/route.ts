import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: Promise<{ matchId: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { matchId } = await params

    // Confirm user is part of the match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: { user1Id: true, user2Id: true }
    })

    if (!match || (match.user1Id !== session.user.id && match.user2Id !== session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const messages = await (prisma.message as any).findMany({
      where: { matchId },
      orderBy: { createdAt: 'asc' },
      take: 50
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Fetch Messages Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ matchId: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { matchId } = await params
    const { text } = await req.json()

    // Confirm user is part of the match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: { user1Id: true, user2Id: true }
    })

    if (!match || (match.user1Id !== session.user.id && match.user2Id !== session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const message = await (prisma.message as any).create({
      data: {
        text,
        senderId: session.user.id,
        matchId
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("Send Message Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
