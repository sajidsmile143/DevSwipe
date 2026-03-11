import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth() as any
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { role, goal, onboarded } = body

    await (prisma.user as any).update({
      where: { id: session.user.id },
      data: {
        role,
        goal,
        onboarded: onboarded ?? true
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("User Update Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
