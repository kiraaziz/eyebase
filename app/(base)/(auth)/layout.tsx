import { getServerSession } from "next-auth"
import { options } from "../../api/auth/[...nextauth]/Options"
import { redirect } from "next/navigation"

export const metadata = {
    title: 'Eyebase | Signin',
  }
 
  
export default async function LayoutLoader({ children, params }: { children: React.ReactNode, params: any }) {

    const session: any = await getServerSession(options)
    if (session) return redirect("/app")

    return <>{children}</>
}