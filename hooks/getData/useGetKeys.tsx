import { prisma } from "../usePrisma"

export const useGetKeys = async (projectId: string) => {

    return await prisma.apiKey.findMany({
        orderBy: {
            createdAt: "desc"
        },
        where: {
            projectId: projectId
        },
        include: {
            permissions: {
                include: {
                    collection: {
                        select: {
                            name: true,
                            image: true,
                            createdAt: true
                        }, 
                    }
                }
            }
        }
    })
}