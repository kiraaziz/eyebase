import { Eyebase } from '@/components/global/Logo'
import Link from 'next/link'
import { Activity, ChevronRight, Database, File, Shield } from 'lucide-react'
import { HeroVideoDialog } from '@/components/heros/HeroVideoDialog'
import { BentoCard, BentoGrid } from "@/components/heros/bento-grid";
import Structure from '@/components/heros/Structure'
import Faq from '@/components/heros/faq'
import { RetroGrid } from '@/components/heros/retro-grid'

export default async function HomePage() {

    const features = [
        {
            Icon: Database,
            name: "Simple Structure",
            description: "Documents live in collections, just like files in folders",
            className: "col-span-3 lg:col-span-1",
            background: <img src='/fun/2.webp' className='h-full w-full object-cover object-left-top' />
        },
        {
            Icon: Shield,
            name: "Security",
            description: "API keys protect your data from unauthorized access",
            className: "col-span-3 lg:col-span-2",
            background: <img src='/fun/4.webp' className='h-full w-full object-cover object-left-top' />
        },
        {
            Icon: File,
            name: "Storage",
            description: "Centralized storage for your files and images",
            className: "col-span-3 lg:col-span-2",
            background: <img src='/fun/3.webp' className='h-full w-full object-cover object-left-top' />
        },
        {
            Icon: Activity,
            name: "Analytics",
            description: "Monitor user activity with visual insights",
            className: "col-span-3 lg:col-span-1",
            background: <img src='/fun/1.webp' className='h-full w-full object-cover object-left-top' />
        },
    ]


    return (
        <>
            <div className="mt-16 flex items-center justify-center w-full p-5 lg:min-h-[70svh]">
                <div className="max-w-4xl">
                    <div className='w-full hidden lg:flex items-center justify-center mb-3 '>
                        <Eyebase size='xl' haveText={false} isMove={true} isBlur={true} />
                    </div>
                    <div className='w-full lg:hidden flex items-center justify-center mb-3'>
                        <Eyebase size='lg' haveText={false} isMove={!true} isBlur={true} />
                    </div>
                    <h1 className='text-2xl lg:text-7xl font-[700] text-center'>The Eye keeps your data simple clean and secure</h1>
                    <h1 className='text-base mt-3 max-w-2xl mx-auto font-[200] text-center text-foreground/70'>Keep your data , collections and documents in one single place . controll it with your own keys after have your key let's make wonder togther</h1>
                    <Link href={"/app"} className="bg-muted flex items-center justify-center gap-2 mx-auto mt-5 w-max  px-3 py-0.5 rounded-full border hover:gap-3 ease-in-out duration-200">
                        <p className="text-base text-foreground/70 ">
                            ✨ Use Eye base
                        </p>
                        <ChevronRight size={15} />
                    </Link>
                </div>

            </div>
            <div className='relative w-full max-w-7xl mx-auto shadow-md shadow-background/60'>
                <HeroVideoDialog
                    className="block "
                    animationStyle="from-center"
                    videoSrc={process.env.DEMO_VIDEO || ""}
                    thumbnailSrc="/background.png"
                    thumbnailAlt="Hero Video"/>
            </div>
            <div className='relative w-full max-w-7xl mx-auto px-5 mt-36 mb-10'>
                <div className='mx-auto max-w-xl -rotate-[25deg] -translate-x-52 -translate-y-20 hidden lg:block'>
                    <Eyebase size='xl' haveText={false} isMove={true} isBlur={true} />
                    <Eyebase size='sm' haveText={false} isMove={true} isBlur={true} />
                </div>
                <h1 className='text-2xl lg:text-7xl font-[700] text-center'>What is eyebase</h1>
                <h1 className='text-base mt-3 max-w-2xl mx-auto font-[200] text-center text-foreground/70 mb-8'>
                    Eyebase is your all-in-one Backend-as-a-Service solution. Build faster with instant API endpoints,
                    secure data storage, and powerful CRUD operations - no complex setup required.
                </h1>
                <BentoGrid>
                    {features.map((feature, idx) => (
                        <BentoCard key={idx} {...feature} />
                    ))}
                </BentoGrid>
            </div>
            <div className='relative w-full max-w-7xl mx-auto px-5 mt-36 mb-10 hidden lg:block'>
                <h1 className='text-2xl lg:text-7xl font-[700] text-left'>How it works</h1>
                <h1 className='text-base mt-1 max-w-xl font-[200] w-full text-foreground/70 mb-8 text-left'>
                    Start building in minutes: set up collections, get your API key, and manage data with simple requests.
                </h1>
                <Structure />
            </div>
            <div className='relative w-full max-w-5xl rounded-xl mx-auto mt-36 mb-10 overflow-hidden bg-muted/20 border lg:px-0 px-4'>
                <div className='flex items-start justify-center gap-10 max-w-4xl pl-8 py-4 '>
                    <Eyebase size='m' haveText={false} isMove={true} isBlur={true} />
                    <div className='flex-1 py-5'>
                        <h1 className='text-2xl lg:text-4xl font-[700] text-left'>Why will I use eyebase</h1>
                        <p className='w-full text-foreground/60'>Our system is designed to be simple and intuitive. Start by setting up your collection in just a few easy steps. Once your collection is ready, you can manage and manipulate it effortlessly using a straightforward fetch API. Whether you're adding new items, updating existing ones, or retrieving data, the process is seamless and efficient. No complicated configurations or technical hurdles—just a clean, user-friendly interface that lets you focus on what matters most: your data.</p>
                    </div>
                </div>
                <RetroGrid className='hidden lg:block top-0' />
            </div>
            <div className='relative w-full max-w-7xl mx-auto px-5 mt-36 mb-10'>
                <h1 className='text-2xl lg:text-7xl font-[700] text-center'>FAQs</h1>
                <Faq />
            </div>

        </>
    )
}
