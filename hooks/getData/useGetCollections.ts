import { prisma } from "../usePrisma"

export const useGetCollections = async (projectsId: string) => {

    return await prisma.collection.findMany({
        orderBy: {
            createdAt: "desc"
        },
        where: {
            projectId: projectsId
        },
        include: {
            _count: {
                select: {
                    Document: true
                }
            }
        }
    })
}