import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { projectId, ownerId, projectTitle } = await req.json()
    const currentUserId = session.user.id

    if (currentUserId === ownerId) {
       return NextResponse.json({ error: "Cannot apply to your own project" }, { status: 400 })
    }

    // Check if match already exists
    let match = await (prisma.match as any).findFirst({
      where: {
        OR: [
          { user1Id: currentUserId, user2Id: ownerId },
          { user1Id: ownerId, user2Id: currentUserId }
        ]
      }
    })

    // If no match, create one
    if (!match) {
      match = await (prisma.match as any).create({
        data: {
          user1Id: currentUserId,
          user2Id: ownerId
        }
      })
    }

    // Send the first application message
    await (prisma.message as any).create({
      data: {
        text: `Hey, I'm interested in collaborating on your project: "${projectTitle}"!`,
        senderId: currentUserId,
        matchId: match.id
      }
    })

    return NextResponse.json({ matchId: match.id })
  } catch (error) {
    console.error("Apply Project Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
