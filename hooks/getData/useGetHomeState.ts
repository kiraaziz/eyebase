import { prisma } from "./../usePrisma"
import { subDays, subMonths, eachDayOfInterval, format } from 'date-fns'

export const useGetHomeState = async (projectId: string, period: "7d" | "30d" | "90d") => {

    const today = new Date()
    let startDate

    switch (period) {
        case '7d':
            startDate = subDays(today, 7)
            break
        case '90d':
            startDate = subMonths(today, 3)
            break
        case '30d':
        default:
            startDate = subDays(today, 30)
            break
    }

    const allDates = eachDayOfInterval({
        start: startDate,
        end: today,
    }).map(date => format(date, 'yyyy-MM-dd'))

    const activity_ = await prisma.activity.groupBy({
        by: ["date"],
        _count: {
            id: true,
        },
        where: {
            createdAt: {
                gte: startDate,
            },
            apiKey: {
                projectId: projectId
            },
        },
    })

    const allActivityTypes = ["LIST", "CREATE", "READ", "UPDATE", "DELETE"]

    const activityState_ = await prisma.activity.groupBy({
        by: ["type"],
        _count: {
            id: true,
        },
        where: {
            apiKey: {
                projectId: projectId,
            },
        },
    })

    const activityStateMap = new Map(
        activityState_.map((el) => [el.type, el._count.id])
    )

    const activityState = allActivityTypes.map((type) => {
        return {
            type: type,
            count: activityStateMap.get(type) || 0,
        }
    })

    const activityMap = new Map(
        activity_.map(el => [el.date, el._count.id])
    )

    const activities = allDates.map(date => ({
        date,
        count: activityMap.get(date) || 0,
    }))

    const totalCollections = await prisma.collection.count({
        where: {
            projectId: projectId
        }
    })


    const totalDoc = await prisma.document.count({
        where: {
            collection: {
                projectId: projectId
            }
        }
    })


    const totalRequests = await prisma.activity.count({
        where: {
            apiKey: {
                projectId: projectId,
            },
        }
    })



    const totalStorage = await prisma.file.aggregate({
        _sum: {
            size: true
        },
        where: {
            projectId: projectId,
        }
    })

    return { totalRequests, totalDoc, totalCollections, totalStorage, activities, activityState }
}