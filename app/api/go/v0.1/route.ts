import { NextResponse } from "next/server"
import { headers } from 'next/headers'
import { prisma } from "@/hooks/usePrisma"
import { useCreateActivity } from "@/hooks/usePermission"

type QueryParams = {
    select?: string[]
    pagination?: {
        page?: number
        perPage?: number
    }
    where?: {
        field: string
        operator: 'equals' | 'not' | 'lt' | 'lte' | 'gt' | 'gte' | 'contains' | 'in' | 'arrayContains'
        value: any
    }[]
}

const buildWhereClause = (conditions: QueryParams['where']) => {
    if (!conditions || conditions.length === 0) return {}

    const whereClause: any = {
        AND: conditions.map(condition => {
            const { field, operator, value } = condition

            switch (operator) {
                case 'equals':
                    return {
                        content: {
                            path: [field],
                            equals: value
                        }
                    }
                case 'not':
                    return {
                        content: {
                            path: `$.${field}`,
                            not: value
                        }
                    }
                case 'lt':
                    return {
                        content: {
                            path: `$.${field}`,
                            lt: value
                        }
                    }
                case 'lte':
                    return {
                        content: {
                            path: `$.${field}`,
                            lte: value
                        }
                    }
                case 'gt':
                    return {
                        content: {
                            path: `$.${field}`,
                            gt: value
                        }
                    }
                case 'gte':
                    return {
                        content: {
                            path: `$.${field}`,
                            gte: value
                        }
                    }
                case 'contains':
                    return {
                        content: {
                            path: `$.${field}`,
                            string_contains: value
                        }
                    }
                case 'in':
                    return {
                        content: {
                            path: `$.${field}`,
                            in: value
                        }
                    }
                case 'arrayContains':
                    return {
                        content: {
                            path: `$.${field}`,
                            array_contains: value
                        }
                    }
                default:
                    return {}
            }
        })
    }

    return whereClause
}

export const GET = async (request: Request) => {

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
                    canList: true,
                    collection: {
                        name: collectionName,
                    },
                },
            },
        },
        include: {
            permissions: {
                where: {
                    canList: true,
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
                message: 'API key invalid or the provided API key does not have permission to create documents',
                success: false,
                value: 403,
            },
            data: null,
            meta: null,
        })
    }

    const collectionId = apiKey.permissions[0].collectionId

    const query: any = JSON.parse(url.searchParams.get("query") as any || '{}')

    const queryParams: QueryParams = {
        select: query.select || [],
        pagination: {
            page: (query.pagination || { page: 1 }).page,
            perPage: (query.pagination || { perPage: 5 }).perPage,
        },
        where: query?.where || [],
    }

    const perPage = queryParams.pagination?.perPage
    const page = queryParams.pagination?.page

    const documents = await prisma.document.findMany({
        where: {
            collectionId,
            ...buildWhereClause(queryParams.where),
        },
        take: Number(perPage),
        skip: (Number(page) - 1) * Number(perPage),
        select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
        },
    })

    const count = await prisma.document.count({
        where: {
            collectionId,
            ...buildWhereClause(queryParams.where),
        },
    })

    await useCreateActivity(apiKey.id, 'LIST')

    const result = (queryParams as any).select.length === 0 ? documents.map((v) => {
        return {
            eyeId_: v.id,
            eyeCreatedAt_: v.createdAt,
            eyeUpdatedAt_: v.updatedAt,
            ...(v as any).content,
        }
    }) : documents.map((v: any) => {
        return (queryParams as any).select.reduce((acc: any, key: any) => {
            acc[key] = v.content[key] !== undefined ? v.content[key] : null
            return {
                eyeId_: v.id,
                eyeCreatedAt_: v.createdAt,
                eyeUpdatedAt_: v.updatedAt,
                ...acc,
            }
        }, {})
    })

    return NextResponse.json({
        status: {
            message: 'List documents successfully',
            success: true,
            value: 200,
        },
        meta: {
            page: Number(page),
            perPage: Number(perPage),
            current: Number(page),
            totalPages: Math.ceil(count / Number(perPage)),
        },
        data: result,
    })
}

export const POST = async (req: Request) => {
    const { data } = await req.json()

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
                    canCreate: true,
                    collection: {
                        name: collectionName,
                    },
                },
            },
        },
        include: {
            permissions: {
                where: {
                    canCreate: true,
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
                message: 'API key invalid or the provided API key does not have permission to create documents',
                success: false,
                value: 403,
            },
            data: null,
            meta: null,
        })
    }

    const collectionId = apiKey.permissions[0].collectionId
    const document: any = await prisma.document.create({
        data: {
            collectionId: collectionId,
            content: data,
        },
    })

    await useCreateActivity(apiKey.id, 'CREATE')

    return NextResponse.json({
        status: {
            message: 'Document created successfully',
            success: true,
            value: 201,
        },
        data: {
            eyeId_: document.id,
            eyeCreatedAt_: document.createdAt,
            eyeUpdatedAt_: document.updatedAt,
            ...document.content,
        },
        meta: null,
    })
}
