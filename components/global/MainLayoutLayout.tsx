"use client"
import { Database, File, Home, KeyIcon, Settings, TestTube2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { Eyebase } from './Logo'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import UserAvatar from './UserAvatar'
import { cn } from '@/lib/utils'

export default function MainLayout({ children, projects, params, mailLink }: { mailLink: any, children: React.ReactNode, projects: any, params: any }) {

    const router = useRouter()
    const paths = [
        { name: "Home", path: "/", icon: Home },
        { name: "Collections", path: "/collection", icon: Database },
        { name: "Storage Bucket", path: "/bucket", icon: File },
        { name: "API Keys", path: "/api-keys", icon: KeyIcon },
        { name: "Playground", path: "/playground", icon: TestTube2 },
        { name: "Settings", path: "/setting", icon: Settings },
    ]

    const pathname = usePathname()
    const linkMatch = (e: string) => ("/" + (pathname.split("/")[2] ? pathname.split("/")[2] : "")) === e

    const [isDivVisible, setIsDivVisible] = useState(true)
    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsDivVisible(entry.isIntersecting)
            },
            {
                root: null,
                threshold: 0.1,
            }
        )

        if (divRef.current) {
            observer.observe(divRef.current)
        }

        return () => {
            if (divRef.current) {
                observer.unobserve(divRef.current)
            }
        }
    }, [])

    return (
        <div className="h-full w-full overflow-x-hidden relative ">
            <div className='w-full bg-background'>
                <div ref={divRef} className="w-full bg-primary/5 pt-8 flex items-center justify-between px-5 lg:px-14 pb-5">
                    <Link href={"/app"} className="flelx lg:hidden">
                        <Eyebase size='sm' haveText={true} isMove={true} isBlur={true} />
                    </Link>
                    <Breadcrumb className='hidden lg:flex'>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className='flex items-center justify-center mr-5'>
                                    <Link href={"/app"} className="">
                                        <Eyebase size='sm' haveText={true} isMove={true} isBlur={true} />
                                    </Link>
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Select onValueChange={(e) => router.push(`/${e}`)}>
                                    <SelectTrigger className="gap-4 w-40 bg-muted/20">
                                        <SelectValue placeholder={projects.filter((e: any) => { return e.id === params.id }).length > 0 ? projects.filter((e: any) => { return e.id === params.id })[0].name : "Select Project"} />
                                    </SelectTrigger>
                                    <SelectContent className='bg-transparent backdrop-blur-xl'>
                                        {projects.map((project: any) => (
                                            <SelectItem value={project.id}>{project.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {paths.map((e) => linkMatch(e.path) &&
                                        <div className='flex  gap-1.5 text-foreground/60 font-light'>
                                            <e.icon size={17} />
                                            {e.name}
                                        </div>
                                    )}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className='flex items-center justify-center gap-4'>
                        <Link href={`${process.env.NEXT_PUBLIC_DOCS_URL}`} className='text-sm font-light text-foreground/60 hidden lg:flex'>
                            Docs
                        </Link>
                        <Link href={`${process.env.NEXT_PUBLIC_DOCS_URL}/help`} className='text-sm font-light text-foreground/60 hidden lg:flex'>
                            Help
                        </Link>
                        <Link href={`${process.env.NEXT_PUBLIC_DOCS_URL}/contact`} className='text-sm font-light text-foreground/60 hidden lg:flex'>
                            Contact
                        </Link>
                        <div className='w-1' />
                        <UserAvatar />
                    </div>
                </div>
            </div>
            <div className='w-full border-b sticky top-0  z-50 bg-background'>
                <div className={` ease-in-out duration-500 px-4 flex flex-row items-center justify-start  bg-primary/5  z-10`}>
                    <div className={`hidden  lg:flex items-center justify-center ${isDivVisible ? "w-0 opacity-0 mr-7" : "w-40 opacity-100"} ease-in-out duration-500 pt-1`}>
                        <Link href={"/app"} className="">
                            <Eyebase size='sm' haveText={!true} isMove={true} isBlur={true} />
                        </Link>
                    </div>
                    <div className='w-full overflow-y-scroll scrollbar-hide'>
                        <div className={`${isDivVisible ? "lg:gap-2" : " lg:gap-4 "} flex flex-row`}>
                            {paths.map((path) => (
                                <div className='translate-y-0.5 space-y-2 pt-3 border-foreground w-max'>
                                    <Link className={cn(!linkMatch(path.path) ? "opacity-60" : "text-primary", ' flex flex-row items-center gap-2 justify-center text-sm rounded-md hover:bg-primary/20 ease-in-out duration-200 bg-primary/0 px-4 py-2  ')} href={`/${pathname.split("/")[1]}${path.path}`}>
                                        <path.icon size={17} />
                                        <p className={cn("break-keep text-nowrap")}>{path.name}</p>
                                    </Link>
                                    <div className={`w-full h-1 rounded-full ${linkMatch(path.path) && "bg-primary"}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-5 ">
                {children} 
            </div>
            <div className='fixed bottom-0 hidden lg:flex items-center justify-center -z-30 w-full overflow-hidden blur-2xl opacity-30'>
                <div className='w-full h-48 bg-gradient-to-tr from-primary via-primary to-secondary max-w-6xl blur-2xl translate-y-1/2 opacity-40'></div>
            </div>
            <div className='fixed top-0 hidden lg:flex items-start justify-center -z-30 w-full overflow-hidden blur-2xl opacity-80'>
                <div className='w-1/2 h-24 bg-gradient-to-tr from-primary via-primary to-secondary max-w-6xl blur-2xl translate-y-1/2 opacity-40'></div>
            </div>
        </div>
    )
}
