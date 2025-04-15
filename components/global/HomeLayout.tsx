import { Eyebase } from '@/components/global/Logo'
import UserAvatar from '@/components/global/UserAvatar'
import Link from 'next/link'
import React from 'react'

export default async function HomeLayout({ children }: any) {

    return (
        <div className="relative overflow-auto">
            <div className="backdrop-blur-3xl h-[4rem] flex-col flex items-start lg:px-5 sticky top-0 z-50 bg-background">
                <div className='h-[4rem] flex items-center justify-center gap-6 w-full px-7'>
                    <Link href={"/home"} className="mr-10">
                        <Eyebase size='sm' haveText={true} isMove={true} isBlur={!true} />
                    </Link>
                    <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/home`} className='text-sm font-light text-foreground/60 hidden lg:flex'>
                        Home
                    </Link>
                    <Link href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs`} className='text-sm font-light text-foreground/60 hidden lg:flex'>
                        About
                    </Link>
                    <Link href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs`} className='text-sm font-light text-foreground/60 hidden lg:flex'>
                        Docs
                    </Link>
                    <Link href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs`} className='text-sm font-light text-foreground/60 hidden lg:flex'>
                        Blog
                    </Link>
                    <Link href={`${process.env.NEXT_PUBLIC_CONTACT_URL}`} className='text-sm font-light text-foreground/60 hidden lg:flex'>
                        Contact
                    </Link>
                    <Link href={`${process.env.NEXT_PUBLIC_CONTACT_URL}`} className='text-sm font-light text-foreground/60 hidden lg:flex'>
                        Help
                    </Link>
                    <div className='flex-1' />
                    <UserAvatar />
                </div>
                <div className='w-full bg-gradient-to-r from-transparent to-transparent h-[1px] via-input'></div>
            </div>
            {children}
            <div className='fixed bottom-0 hidden lg:flex items-center justify-center -z-30 w-full overflow-hidden blur-2xl opacity-30'>
                <div className='w-full h-48 bg-gradient-to-tr from-primary via-primary to-secondary max-w-6xl blur-2xl translate-y-1/2 opacity-40'></div>
            </div>
        </div>
    )
}
