import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { Octokit } from "octokit"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const session = await auth() as any
    
    if (!session?.accessToken || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const octokit = new Octokit({ auth: session.accessToken })

    // 1. Fetch user repos
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      direction: 'desc',
      per_page: 5
    })

    // 2. Fetch languages for these repos
    const languageMap: Record<string, number> = {}
    for (const repo of repos) {
      try {
        const { data: langs } = await octokit.rest.repos.listLanguages({
          owner: repo.owner.login,
          repo: repo.name,
        })
        Object.keys(langs).forEach((lang) => {
          languageMap[lang] = (languageMap[lang] || 0) + 1
        })
      } catch (err) {
        console.warn(`Could not fetch languages for ${repo.name}`)
      }
    }

    const skills = Object.entries(languageMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([lang]) => lang)

    // 3. Prepare bio if empty
    const bioText = repos.length > 0 
      ? `Passionate developer primarily working with ${skills.slice(0,3).join(", ")}. Latest project: ${repos[0].name}.`
      : "Developer ready to collaborate on innovative projects."

    // 4. Transform repos to projects
    const projectsToCreate = repos.map(repo => ({
      title: repo.name,
      description: repo.description || "No description provided.",
      url: repo.html_url,
      githubUrl: repo.html_url
    }))

    // 5. Update user and replace projects
    await prisma.$transaction([
      prisma.project.deleteMany({ where: { userId: session.user.id } }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          skills,
          bio: bioText,
          projects: {
            create: projectsToCreate
          }
        }
      })
    ])

    return NextResponse.json({ 
      success: true, 
      data: { skills, bio: bioText, projectsCount: projectsToCreate.length } 
    })
  } catch (error: any) {
    console.error("Sync Error:", error)
    return NextResponse.json({ 
      error: "Failed to sync with GitHub", 
      message: error.message 
    }, { status: 500 })
  }
}
