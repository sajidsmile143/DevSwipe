import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const matches = await (prisma.match as any).findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: {
          select: { id: true, name: true, image: true, role: true, bio: true }
        },
        user2: {
          select: { id: true, name: true, image: true, role: true, bio: true }
        },
        messages: {
           orderBy: { createdAt: 'desc' },
           take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedMatches = matches.map((m: any) => {
      const partner = m.user1Id === userId ? m.user2 : m.user1
      return {
        id: m.id,
        partner,
        lastMessage: m.messages[0]?.text || "No messages yet. Start building something!",
        createdAt: m.createdAt
      }
    })

    return NextResponse.json(formattedMatches)
  } catch (error) {
    console.error("Matches API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
