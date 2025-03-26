import { NextResponse } from "next/server"
import { prisma } from "@/hooks/usePrisma"
import { useHavePermission } from "@/hooks/usePermission"


export const POST = async (req: Request) => {

    const { json, projectId, colId } = await req.json()


    const havePermission = await useHavePermission(projectId, ["admin", "editor"])
    if (havePermission !== true) return NextResponse.json(havePermission)

    const doc = await prisma.document.create({
        data: {
            content: json,
            collectionId: colId
        }
    })

    return NextResponse.json({
        success: true,
        message: "Document created successfully",
        doc
    })
}

export const PUT = async (req: Request) => {

    const { id, json, projectId, colId } = await req.json()

    const havePermission = await useHavePermission(projectId, ["admin", "editor"])
    if (havePermission !== true) return NextResponse.json(havePermission)

    const doc = await prisma.document.update({
        where: {
            id: id,
            collectionId: colId
        },
        data: {
            content: json,
            collectionId: colId
        }
    })

    return NextResponse.json({
        success: true,
        message: "Document updated successfully",
        doc
    })
}



export const DELETE = async (req: Request) => {

    const { id, projectId, colId } = await req.json()

    const havePermission = await useHavePermission(projectId, ["admin", "editor"])
    if (havePermission !== true) return NextResponse.json(havePermission)

    const doc = await prisma.document.delete({
        where: {
            id: id,
            collectionId: colId
        }
    })

    return NextResponse.json({
        success: true,
        message: "Document deleted successfully",
        doc
    })
}
