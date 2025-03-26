import { options } from "@/app/api/auth/[...nextauth]/Options"
import { prisma } from "./usePrisma"
import { getServerSession } from "next-auth"

export const useGetFiles = async (projectId: string) => {

    return await prisma.file.findMany({
        orderBy: {
            createdAt: "desc"
        },
        where: {
            projectId: projectId
        },
    })
}

export const useGetProjects = async () => {

    const { user: { id } }: any = await getServerSession(options)

    return await prisma.project.findMany({
        orderBy: {
            createdAt: "desc"
        },
        where: {
            membership: {
                some: {
                    userId: id
                }
            }
        },
    })
}

export const useGetProject = async (projectId: string) => {

    return await prisma.project.findUnique({
        where: {
            id: projectId
        },
        include: {
            membership: {
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    user: true
                }
            }
        }
    })
}

export const useGetRole = async (projectId: string) => {

    const { user: { id } }: any = await getServerSession(options)

    return await prisma.membership.findFirst({
        where: {
            projectId: projectId,
            userId: id
        },
    })
}


export type GetProjectType = Awaited<ReturnType<typeof useGetProject>>
export type GetRoleType = Awaited<ReturnType<typeof useGetRole>>
