"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Grid2x2Icon, LogOut, User2 } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "../ui/button"

export default function UserAvatar() {

    const session: any = useSession()

    if (session.status === "loading") return <div className="h-9 w-9 rounded-full skeleton-box" ></div>

    if (!session.data?.user) return <Link href={"/app"}>
        <Button>
            Join us
        </Button>
    </Link>

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="outline-none">
                    <AvatarImage src={session.data.user.image} className="object-cover" />
                    <AvatarFallback>{session.data.user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="m-3 w-56 ">
                <DropdownMenuLabel>
                    <h1>{session.data.user.name}</h1>
                    <p className="text-xs font-light text-foreground/60">{session.data.user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/app/">
                    <DropdownMenuItem className="gap-1 hover:gap-2 hover:cursor-pointer ease-in-out duration-200 transition-all" >
                        <Grid2x2Icon size={18} />
                        Dashboard
                    </DropdownMenuItem>
                </Link>
                <Link href="/app/profile">
                    <DropdownMenuItem className="gap-1 hover:gap-2 hover:cursor-pointer ease-in-out duration-200 transition-all" >
                        <User2 size={18} />
                        Profile
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="gap-1 text-destructive hover:gap-2 hover:cursor-pointer hover:!bg-destructive/10 hover:!text-destructive ease-in-out duration-200 transition-all" >
                    <LogOut size={18} />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}
