import { NextResponse } from "next/server"
import { prisma } from "@/hooks/usePrisma"
import { useHavePermission } from "@/hooks/usePermission"


export const POST = async (req: Request) => {

    const { name, image, projectId } = await req.json()

    const havePermission = await useHavePermission(projectId, ["admin", "editor"])
    if (havePermission !== true) return NextResponse.json(havePermission)
    if (!name) return NextResponse.json({
        success: false,
        message: "Name is required",
    })

    const collection = await prisma.collection.create({
        data: {
            name: name,
            image: image,
            projectId: projectId
        }
    })
    return NextResponse.json({
        success: true,
        message: "Collection created successfully",
        collection
    })
}

export const PUT = async (req: Request) => {

    const { name, image, projectId, id } = await req.json()

    const havePermission = await useHavePermission(projectId, ["admin", "editor"])
    if (havePermission !== true) return NextResponse.json(havePermission)
    if (!name) return NextResponse.json({
        success: false,
        message: "Name is required",
    })

    const collection = await prisma.collection.update({
        where: {
            id: id,
            projectId: projectId
        },
        data: {
            name: name,
            image: image,
        }
    })

    return NextResponse.json({
        success: true,
        message: "Collection updated successfully",
        collection
    })
}



export const DELETE = async (req: Request) => {


    const { projectId, id } = await req.json()
    const havePermission = await useHavePermission(projectId, ["admin", "editor"])
    if (havePermission !== true) return NextResponse.json(havePermission)

    const collection = await prisma.collection.delete({
        where: {
            id: id,
            projectId: projectId
        }
    })

    return NextResponse.json({
        success: true,
        message: "Collection deleted successfully",
        collection
    })
}

