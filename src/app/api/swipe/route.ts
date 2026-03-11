import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { targetUserId, type } = await req.json()
    const currentUserId = session.user.id

    // 1. Record the swipe
    await prisma.swipe.upsert({
      where: {
        swiperId_swipedId: {
          swiperId: currentUserId,
          swipedId: targetUserId,
        },
      },
      update: { type },
      create: {
        swiperId: currentUserId,
        swipedId: targetUserId,
        type,
      },
    })

    // 2. Check for a match if it was a LIKE
    if (type === "LIKE") {
      const mutualSwipe = await prisma.swipe.findUnique({
        where: {
          swiperId_swipedId: {
            swiperId: targetUserId,
            swipedId: currentUserId,
          },
        },
      })

      if (mutualSwipe && mutualSwipe.type === "LIKE") {
        // We have a match!
        const user1Id = currentUserId < targetUserId ? currentUserId : targetUserId
        const user2Id = currentUserId < targetUserId ? targetUserId : currentUserId
        
        const existingMatch = await prisma.match.findUnique({
          where: {
            user1Id_user2Id: { user1Id, user2Id }
          }
        })

        const match = existingMatch || await prisma.match.create({
          data: { user1Id, user2Id },
        })

        return NextResponse.json({ match: true, matchId: match.id })
      }
    }

    return NextResponse.json({ match: false })
  } catch (error) {
    console.error("Swipe API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
