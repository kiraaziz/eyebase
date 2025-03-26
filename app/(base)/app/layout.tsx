import { getServerSession } from "next-auth"
import { options } from "../../api/auth/[...nextauth]/Options"
import { redirect } from "next/navigation"

export default async function LayoutLoader({ children }: { children: React.ReactNode }) {

    const session: any = await getServerSession(options)
    if (!session) return redirect("/signin")

    return <>{children}</>
}