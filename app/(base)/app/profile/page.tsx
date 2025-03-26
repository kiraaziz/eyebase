"use client"
import Loader from "@/components/global/Loader"
import { LogOut, SaveAll } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import LoadingButton from "@/components/global/LoadingButton"
import { Input } from "@/components/ui/input"
import { setState } from "@/hooks/useState"
import { useFetch } from "@/hooks/useFecth"
import { Button } from "@/components/ui/button"
import { Avatars } from "@/hooks/useAvatars"


export default function UserAvatar() {

    const { update } = useSession()
    const session: any = useSession()
    const [user, setUser] = useState({
        name: "",
        email: "",
        image: `${Avatars[0]}`
    })


    useEffect(() => {

        if (session.data && session.data.user) {
            setUser({
                name: session.data.user.name,
                email: session.data.user.email,
                image: session.data.user.image
            })
        }

    }, [session])

    const [isUpdate, useUpdate] = useFetch("/auth/user/", "PATCH", async () => {
        update()
    })

    return (
        <div className='w-full max-w-2xl mx-auto mt-10 p-5'>
            {(session.status === "loading") ? <div className="p-5 flex items-center justify-center min-h-[80svh]">
                <Loader />
            </div>
                : session.data?.user ? <form onSubmit={(e) => e.preventDefault()} className=' max-w-5xl pt-3 mx-auto  flex   flex-col '>
                    <h1 className='mt-5 text-2xl font-bold '>Update profile</h1>
                    <Input className='mb-2 mt-1' placeholder='your name' value={user.name} onChange={(e) => setState(setUser, "name", e.target.value)} />
                    <Input disabled type='email' className='' placeholder='email@something.com' value={user.email} onChange={(e) => setState(setUser, "email", e.target.value)} />
                    <div className='overflow-x-auto  pb-2 w-full  mt-2'>
                        <div className='flex w-max gap-2'>
                            {Avatars.map((avatar) => (
                                <div onClick={() => setState(setUser, "image", avatar)} className={`${avatar === user.image ? "border border-primary" : "border"} hover:cursor-pointer ease-in-out duration-200 bg-muted/20 p-2 rounded `}>
                                    <img src={avatar} className='h-12 rounded-fullx' />
                                </div>
                            ))}
                        </div>
                    </div>

                    <LoadingButton type='submit' className='mt-2 w-max min-w-20' isLoading={isUpdate} onClick={async () => await useUpdate(user)}>
                        <SaveAll size={20} />
                        Update
                    </LoadingButton>
                </form>
                    : null}

            <div className='mt-5 max-w-5xl  mx-auto  flex   flex-col'>
                <div className="mt-1 border rounded-md border-destructive">
                    <div className="px-3 pt-3">
                        <h1 className='text-2xl font-bold '>Logout</h1>
                        <p className='text-sm  text-foreground/60 mb-3'>Are you sure you want to logout</p>
                    </div>
                    <div className="w-full p-3 bg-destructive/20 border-t border-destructive">
                        <Button onClick={() => signOut()} variant="destructive" className="px-8">
                            <LogOut size={20} />
                            Sign out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
