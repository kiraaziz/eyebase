import HomeLayout from '@/components/global/HomeLayout'
import Loader from '@/components/global/Loader'
import { FollowEye } from '@/components/global/Logo'
import { Suspense } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div className="relative overflow-auto">
            <div className="backdrop-blur-3xl h-[4rem] flex-col flex items-start px-5 sticky top-0 z-50 bg-background">
                <div className='h-[4rem] flex items-center justify-center gap-6 w-full px-7'>
                    <div className="flex items-center justify-center gap-1 text-primary font-semibold mr-10">
                        <div className="h-8 w-8 flex items-center justify-center overflow-hidden">
                            <div className="scale-[0.2]">
                                <FollowEye />
                            </div>
                        </div>
                        Eyebase
                    </div>
                    {[...Array(6)].map(() => (
                        <div className="h-5 w-16 rounded skeleton-box hidden lg:flex" ></div>
                    ))}
                    <div className='flex-1' />
                    <div className="h-9 w-9 rounded-full skeleton-box" ></div>
                </div>
                <div className='w-full bg-gradient-to-r from-transparent to-transparent h-[1px] via-input'></div>
            </div>
            <div className="p-5 flex items-center justify-center min-h-[80svh]">
                <Loader />
            </div>
            <div className='fixed bottom-0 hidden lg:flex items-center justify-center -z-30 w-full overflow-hidden blur-2xl opacity-30'>
                <div className='w-full h-48 bg-gradient-to-tr from-primary via-primary to-secondary max-w-6xl blur-2xl translate-y-1/2 opacity-40'></div>
            </div>
        </div>}>
            <LayoutLoader children={children} />
        </Suspense>
    )
}


async function LayoutLoader({ children }: { children: React.ReactNode }) {

    return (
        <HomeLayout>
            <div className='min-h-[100svh] w-full '>
                {children}
            </div>
        </HomeLayout>
    )
}
