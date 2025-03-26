import Empty from '@/components/global/Empty'
import Loader from '@/components/global/Loader'
import CreateProject from '@/components/project/CreateProject'
import { Button } from '@/components/ui/button'
import { useGetProjects } from '@/hooks/useGet'
import { useTimeAgo } from '@/hooks/useTime'
import { ChevronRight, Clock, Database, Plus } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export const metadata = {
  title: 'Eyebase | Database',
}
 

export default function page({ params }: { params: any }) {

  return (
    <Suspense key={JSON.stringify(params)} fallback={<div className="p-5 flex items-center justify-center min-h-[80svh]">
      <Loader />
    </div>}>
      <PageLoader params={params} />
    </Suspense>
  )
}

async function PageLoader({ params }: { params: any }) {
  const database = await useGetProjects()

  if (database.length === 0) return <Empty title='No database created yet'>
    <CreateProject>
      <Button>
        <Plus size={20} />
        Create a database
      </Button>
    </CreateProject>
  </Empty>


  return (
    <div className=" p-5 w-full ">
      <div className='max-w-3xl mx-auto'>
        <div className="mt-20">
          <div className='flex items-center justify-end mb-3'>
            <CreateProject>
              <Button>
                <Database size={20} />
                Create a database
              </Button>
            </CreateProject>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
            {database.map((db) => (
              <Link href={`/${db.id}`} className="rounded-md border flex items-start justify-start gap-2 p-3 bg-muted/20 hover:bg-muted/40 pr-5 ease-in-out duration-200 hover:pr-2 backdrop-blur">
                <Database size={20} className='mt-1 text-primary' />
                <div className='flex-4'>
                  <h1 className=''>{db.name}</h1>
                  <p className='flex items-center justify-center gap-1 text-xs font-light text-foreground/50'>
                    <Clock size={12} />
                    {useTimeAgo(db.createdAt)}
                  </p>
                </div>
                <ChevronRight size={25} className=' text-foreground/60 ml-auto my-auto' />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
