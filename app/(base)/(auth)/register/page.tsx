"use client"
import LoadingButton from '@/components/global/LoadingButton'
import { FollowEye } from '@/components/global/Logo'
import { Input } from '@/components/ui/input'
import { useFetch } from '@/hooks/useFecth'
import { setState } from '@/hooks/useState'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Avatars } from '@/hooks/useAvatars'

export default function page() {

    const router = useRouter()
    const [user, setUser] = useState({
        name: "",
        email: "",
        image: `${Avatars[0]}`
    })

    const [isCreate, useCreate] = useFetch("/auth/user/", "POST", (res) => {
        if (res.success) {
            const currentTime = new Date().toISOString()
            localStorage.setItem('currentTime', currentTime)
            router.push(`/verify?email=${user.email.toLowerCase()}`)
        }
    })

    return (
        <form onSubmit={(e) => e.preventDefault()} className=' max-w-5xl p-4 mx-auto  flex items-center flex-col lg:pt-[20svh] text-center pb-10'>
            <FollowEye />
            <h1 className='mt-5 text-2xl font-bold'>Join Eyebase</h1>
            <p className='text-sm text-foreground/60 mb-3'>Create your account to access all the <br />features and functionality.</p>
            <Input className='max-w-sm mb-2' placeholder='your name' value={user.name} onChange={(e) => setState(setUser, "name", e.target.value)} />
            <Input type='email' className='max-w-sm' placeholder='email@something.com' value={user.email} onChange={(e) => setState(setUser, "email", e.target.value)} />
            <div className='overflow-x-auto max-w-sm pb-2 w-full  mt-2'>
                <div className='flex w-max gap-2'>
                    {Avatars.map((avatar) => (
                        <div onClick={() => setState(setUser, "image", avatar)} className={`${avatar === user.image ? "border border-primary" : "border"} hover:cursor-pointer ease-in-out duration-200 bg-muted/20 p-2 rounded `}>
                            <img src={avatar} className='h-12 min-w-12' />
                        </div>
                    ))}
                </div>
            </div>

            <LoadingButton type='submit' className='max-w-sm w-full mt-2 lg:hover:gap-4 ease-in-out duration-200' isLoading={isCreate} onClick={async () => await useCreate(user)}>
                Continuer
                <ChevronRight size={20} />
            </LoadingButton>
            <div className='mt-4 text-foreground/60 text-sm w-full flex items-center justify-end max-w-sm'>
                <p>Already have an account?
                    <a className='underline hover:text-foreground mx-2' href="/signin">
                        Sign in
                    </a>
                </p>
            </div>
        </form>
    )

}


