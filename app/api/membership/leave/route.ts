import { prisma } from "@/hooks/usePrisma"
import { getServerSession } from "next-auth"
import { options } from "../../auth/[...nextauth]/Options"
import { useHavePermission } from "@/hooks/usePermission"
import { NextResponse } from "next/server"

export const DELETE = async (req: Request) => {

    const { user: { id } }: any = await getServerSession(options)
    const { projectId } = await req.json()

    const havePermission = await useHavePermission(projectId, ["reader", "editor"])
    if (havePermission !== true) return NextResponse.json(havePermission)

    const project = await prisma.membership.deleteMany({
        where: {
            userId: id,
            projectId: projectId
        }
    })

    return NextResponse.json({
        success: true,
        message: "Leave group successfully",
        project
    })
}

