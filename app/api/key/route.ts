import { NextResponse } from "next/server"
import { prisma } from "@/hooks/usePrisma"
import { useHavePermission } from "@/hooks/usePermission"
import Randomise from "randomstring"

export const POST = async (req: Request) => {

    const { projectId, name, collections } = await req.json()

    const havePermission = await useHavePermission(projectId, ["admin", "editor"])
    if (havePermission !== true) return NextResponse.json(havePermission)

    if (!name) return NextResponse.json({
        success: false,
        message: "Name is required",
    })

    if (collections.length === 0) return NextResponse.json({
        success: false,
        message: "Collection is required",
    })

    const apiKey = await prisma.apiKey.create({
        data: {
            name,
            key: `eye_${Randomise.generate(50)}`,
            projectId: projectId,
            permissions: {
                createMany: {
                    data: collections.map((col: any) => {
                        return {
                            collectionId: col.colId,
                            canList: col.canList,
                            canRead: col.canRead,
                            canCreate: col.canCreate,
                            canUpdate: col.canUpdate,
                            canDelete: col.canDelete
                        }
                    })
                }
            }
        }
    })

    return NextResponse.json({
        success: true,
        message: "API key created successfully",
        apiKey
    })
}


export const PUT = async (req: Request) => {

    const {
        id,
        projectId,
        collections, name } = await req.json()

    const havePermission = await useHavePermission(projectId, ["admin", "editor"])
    if (havePermission !== true) return NextResponse.json(havePermission)
    if (!name) return NextResponse.json({
        success: false,
        message: "Name is required",
    })

    if (collections.length === 0) return NextResponse.json({
        success: false,
        message: "Collection is required",
    })
 
    const existingApiKey = await prisma.apiKey.findUnique({
        where: {
            id: id,
            projectId: projectId,
        },
        include: {
            permissions: true
        }
    })

    if (!existingApiKey) return NextResponse.json({
        success: false,
        message: "API key not found",
    })

    const existingPermissions = existingApiKey.permissions || []

    const collectionsToUpdate = collections.filter((col: any) => col.id)

    const collectionsToCreate = collections.filter((col: any) => !col.id)

    const collectionsToDelete = existingPermissions
        .filter(p => !collections.some((col: any) => col.id === p.id))
        .map(p => p.id)

    const apiKey = await prisma.apiKey.update({
        where: {
            id: id,
            projectId: projectId,
        },
        data: {
            name,
            permissions: {
                update: collectionsToUpdate.map((col: any) => ({
                    where: { id: col.id },
                    data: {
                        canList: col.canList,
                        canRead: col.canRead,
                        canCreate: col.canCreate,
                        canUpdate: col.canUpdate,
                        canDelete: col.canDelete
                    }
                })),
                createMany: collectionsToCreate.length > 0 ? {
                    data: collectionsToCreate.map((col: any) => ({
                        collectionId: col.colId,
                        canList: col.canList,
                        canRead: col.canRead,
                        canCreate: col.canCreate,
                        canUpdate: col.canUpdate,
                        canDelete: col.canDelete
                    }))
                } : undefined,
                deleteMany: collectionsToDelete.length > 0 ? {
                    id: { in: collectionsToDelete }
                } : undefined
            }
        },
        include: {
            permissions: true
        }
    })

    return NextResponse.json({
        success: true,
        message: "API keu updated successfully",
        apiKey
    })
}

export const DELETE = async (req: Request) => {

    const { id, projectId } = await req.json()

    const havePermission = await useHavePermission(projectId, ["admin", "editor"])
    if (havePermission !== true) return NextResponse.json(havePermission)


    const apiKey = await prisma.apiKey.delete({
        where: {
            id: id
        },
    })

    return NextResponse.json({
        success: true,
        message: "API key deleted successfully",
        apiKey
    })
}
