import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentUserId = session.user.id

    // Get IDs of users already swiped on
    const swipes = await prisma.swipe.findMany({
      where: { swiperId: currentUserId },
      select: { swipedId: true },
    })

    const currentUser = await (prisma.user as any).findUnique({
      where: { id: currentUserId },
      select: { role: true, goal: true }
    })

    const excludedIds = [...swipes.map((s: { swipedId: string }) => s.swipedId), currentUserId]

    // Define complementary role
    let preferredRole = undefined
    if (currentUser?.role === 'FRONTEND') preferredRole = 'BACKEND'
    if (currentUser?.role === 'BACKEND') preferredRole = 'FRONTEND'

    // Fetch potential matches
    const users = await (prisma.user as any).findMany({
      where: {
        id: { notIn: excludedIds },
        onboarded: true, // Only show those who completed onboarding
      },
      include: {
        projects: true,
      },
      orderBy: [
        // Prioritize people with same or helpful goals
        { goal: 'desc' }, 
        { createdAt: 'desc' }
      ],
      take: 30,
    })

    console.log("Database results total count:", users.length)
    if (users.length > 0) {
      console.log("Sample user 1 onboarded status:", users[0].onboarded)
    }

    // Sort in memory to put preferredRole first if available
    const sortedUsers = users.sort((a: any, b: any) => {
      if (a.role === preferredRole) return -1
      if (b.role === preferredRole) return 1
      return 0
    })

    return NextResponse.json(sortedUsers)
  } catch (error) {
    console.error("Discover Fetch Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
