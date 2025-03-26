import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { options } from "../auth/[...nextauth]/Options"
import { prisma } from "@/hooks/usePrisma"
import { useHavePermission } from "@/hooks/usePermission"

export const POST = async (req: Request) => {

    const { user: { id } }: any = await getServerSession(options)
    const { name, image } = await req.json()

    if (!name) return NextResponse.json({
        success: false,
        message: "Database name is required",
    })

    const project = await prisma.project.create({
        data: {
            name: name,
            image: image,
            membership: {
                create: {
                    userId: id,
                    role: "admin",
                    blocked: false
                }
            }
        }
    })

    return NextResponse.json({
        success: true,
        message: "Project created successfully",
        project
    })
}


export const PUT = async (req: Request) => {

    const { projectId, name } = await req.json()

    const havePermission = await useHavePermission(projectId, ["admin"])
    if (havePermission !== true) return NextResponse.json(havePermission)

    if (!name) return NextResponse.json({
        success: false,
        message: "Database name is required",
    })

    const project = await prisma.project.update({
        data: {
            name: name
        },
        where: {
            id: projectId
        }
    })

    return NextResponse.json({
        success: true,
        message: "Project updated successfully",
        project
    })
}



export const DELETE = async (req: Request) => {

    const { projectId } = await req.json()

    const havePermission = await useHavePermission(projectId, ["admin"])
    if (havePermission !== true) return NextResponse.json(havePermission)

    const project = await prisma.project.delete({
        where: {
            id: projectId
        }
    })

    return NextResponse.json({
        success: true,
        message: "Project deleted successfully",
        project
    })
}

