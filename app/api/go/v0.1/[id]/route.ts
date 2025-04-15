import { NextResponse } from "next/server"
import { headers } from 'next/headers'
import { prisma } from "@/hooks/usePrisma"
import { useCreateActivity } from "@/hooks/usePermission"

export const GET = async (request: Request, { params }: any) => {
    const headersList = await headers()
    const key = headersList.get('Authorization')

    const url = new URL(request.url)
    const collectionName = url.searchParams.get('collectionName')

    if (!collectionName) {
        return NextResponse.json({
            status: {
                message: 'Invalid collection name',
                success: false,
                value: 400,
            },
            data: null,
            meta: null,
        })
    }

    const apiKey = await prisma.apiKey.findFirst({
        where: {
            key: key || "",
            permissions: {
                some: {
                    canRead: true,
                    collection: {
                        name: collectionName,
                    },
                },
            },
        },
        include: {
            permissions: {
                where: {
                    canRead: true,
                    collection: {
                        name: collectionName,
                    },
                },
            },
        },
    })

    if (!apiKey) {
        return NextResponse.json({
            status: {
                message: 'API key invalid or no permission to read from the collection',
                success: false,
                value: 403,
            },
            data: null,
            meta: null,
        })
    }

    const collectionId = apiKey.permissions[0].collectionId
    const id = await params.id.replaceAll(" ", "")

    const document = await prisma.document.findUnique({
        where: {
            id: id || "",
            collectionId,
        },
    })

    if (!document) {
        return NextResponse.json({
            status: {
                message: 'Document not found',
                success: false,
                value: 404,
            },
            data: null,
            meta: null,
        })
    }

    await useCreateActivity(apiKey.id, 'READ')

    return NextResponse.json({
        status: {
            message: 'Document fetched successfully',
            success: true,
            value: 200,
        },
        meta: {
            collectionName: collectionName,
        },
        data: {
            eyeId_: document.id,
            eyeCreatedAt_: document.createdAt,
            eyeUpdatedAt_: document.updatedAt,
            ...(document as any).content 
        },
    })
}

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
    const headersList = await headers()
    const key = headersList.get('Authorization')

    const url = new URL(req.url)
    const collectionName = url.searchParams.get('collectionName')

    if (!collectionName) {
        return NextResponse.json({
            status: {
                message: 'Invalid collection name',
                success: false,
                value: 400,
            },
            data: null,
            meta: null,
        })
    }

    const apiKey = await prisma.apiKey.findFirst({
        where: {
            key: key || "",
            permissions: {
                some: {
                    canDelete: true,
                    collection: {
                        name: collectionName,
                    },
                },
            },
        },
        include: {
            permissions: {
                where: {
                    canDelete: true,
                    collection: {
                        name: collectionName,
                    },
                },
            },
        },
    })

    if (!apiKey) {
        return NextResponse.json({
            status: {
                message: 'API key invalid or no permission to delete from the collection',
                success: false,
                value: 403,
            },
            data: null,
            meta: null,
        })
    }

    const collectionId = apiKey.permissions[0].collectionId

    const id = await params.id.replaceAll(" ", "")

    const document = await prisma.document.findUnique({
        where: {
            id: id || "",
            collectionId,
        },
    })

    if (!document) {
        return NextResponse.json({
            status: {
                message: 'Document not found',
                success: false,
                value: 404,
            },
            data: null,
            meta: null,
        })
    }
 
    await prisma.document.delete({
        where: {
            id: id || "",
            collectionId,
        },
    })

    await useCreateActivity(apiKey.id, 'DELETE')

    return NextResponse.json({
        status: {
            message: 'Document deleted successfully',
            success: true,
            value: 200,
        },
        data: {
            eyeId_: document.id,
        },
        meta: {
            collectionName: collectionName,
        },
    })
}
 
export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
    const data = await req.json()

    const headersList = await headers()
    const key = headersList.get('Authorization')
 
    const url = new URL(req.url)
    const collectionName = url.searchParams.get('collectionName')

    if (!collectionName) {
        return NextResponse.json({
            status: {
                message: 'Invalid collection name',
                success: false,
                value: 400,
            },
            data: null,
            meta: null,
        })
    }

    const apiKey = await prisma.apiKey.findFirst({
        where: {
            key: key || "",
            permissions: {
                some: {
                    canUpdate: true,
                    collection: {
                        name: collectionName,
                    },
                },
            },
        },
        include: {
            permissions: {
                where: {
                    canUpdate: true,
                    collection: {
                        name: collectionName,
                    },
                },
            },
        },
    })

    if (!apiKey) {
        return NextResponse.json({
            status: {
                message: 'API key invalid or no permission to update the document',
                success: false,
                value: 403,
            },
            data: null,
            meta: null,
        })
    }

    const collectionId = apiKey.permissions[0].collectionId
    const id = await params.id.replaceAll(" ", "")

    const document = await prisma.document.update({
        where: {
            id: id || "",
            collectionId,
        },
        data: {
            content: data,
        },
    })

    await useCreateActivity(apiKey.id, 'UPDATE')

    return NextResponse.json({
        status: {
            message: 'Document updated successfully',
            success: true,
            value: 200,
        },
        data: {
            eyeId_: document.id,
            eyeCreatedAt_: document.createdAt,
            eyeUpdatedAt_: document.updatedAt,
            ...(document as any).content 
        },
        meta: {
            collectionName: collectionName,
        },
    })
}
