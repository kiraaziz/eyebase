import { prisma } from "../usePrisma"

export const useGetDocuments = async (projectId: string, docId: string) => {

    return await prisma.document.findMany({
        orderBy: {
            createdAt: "desc"
        },
        where: {
            collection: {
                id: docId,
                projectId: projectId
            }
        }
    })
}