import MainLayout from "@/components/global/MainLayoutLayout"
import { useHaveUIPermission } from "@/hooks/usePermission"
import { prisma } from "@/hooks/usePrisma"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { Suspense } from "react"
import { options } from "../api/auth/[...nextauth]/Options"
import Loader from "@/components/global/Loader"
import { redirect } from "next/navigation"
import Empty from "@/components/global/Empty"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function Layout({ children, params }: { children: React.ReactNode, params: any }) {

    return (
        <Suspense fallback={<div className="p-5 flex items-center justify-center min-h-[80svh]">
              <Loader />
            </div>}>
            <LayoutLoader children={children} params={params} />
        </Suspense>
    )
}


export async function LayoutLoader({ children, params }: { children: React.ReactNode, params: any }) {

    const session: any = await getServerSession(options)
    if (!session) return redirect("/api/auth/signin")

    const permission = await useHaveUIPermission(params.id)
    const projects = await prisma.project.findMany({
        where: {
            membership: {
                some: {
                    userId: session.user?.id || ""
                }
            }
        }
    })

    if (!permission) return <MainLayout mailLink={`mailto:${process.env.email}`} params={params} projects={projects}>
        <Empty title='Database not found' isReverse={true} path="404">
            <Link href={"/"}>
                <Button>
                    <ChevronLeft size={20} />
                    Back
                </Button>
            </Link>
        </Empty>
    </MainLayout>

    return (
        <MainLayout mailLink={`mailto:${process.env.email}`} params={params} projects={projects}>
            {children}
        </MainLayout>
    )
}
