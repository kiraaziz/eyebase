import { Button } from '@/components/ui/button'
import { Clock, Plus, Settings } from 'lucide-react'
import { Suspense } from 'react'
import CreateCollectionForm, { Icon } from '@/components/collection/CreateCollectionForm'
import { useGetCollections } from '@/hooks/getData/useGetCollections'
import { useTimeAgo } from '@/hooks/useTime'
import Link from 'next/link'
import Empty from '@/components/global/Empty'
import { useHelfText } from '@/hooks/useState'

export const metadata = {
  title: 'Eyebase | Collections',
}


export default function page({ params }: { params: any }) {

  return (
    <Suspense key={Date.now()} fallback={<div className='w-full max-w-6xl mx-auto mt-10'>
      <div className='flex items-center justify-between w-full mb-4 gap-2'>
        <h1 className='text-2xl font-bold skeleton-box h-9 w-48 rounded-lg loader-animation'></h1>
      </div>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2'>
        {[...Array(10)].map((e) => (
          <div className='p-4 rounded-md loader-animation h-20' />
        ))}
      </div>
    </div>}>
      <PageLoader params={params} />
    </Suspense>
  )
}

async function PageLoader({ params }: { params: any }) {

  const collections = await useGetCollections(params.id)

  if (collections.length === 0) return <Empty title='No collection created yet'>
    <CreateCollectionForm
      projectId={params.id}
      target={null}>
      <Button>
        <Plus size={20} />
        New collections
      </Button>
    </CreateCollectionForm>
  </Empty>

  return (
    <div className='w-full max-w-6xl mx-auto mt-10 '>
      <div className='flex items-center justify-between w-full mb-4'>
        <h1 className='text-2xl font-bold'>Collections</h1>
        <CreateCollectionForm
          projectId={params.id}
          target={null}>
          <Button>
            <Plus size={20} />
            New collections
          </Button>
        </CreateCollectionForm>
      </div>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2'>
        {collections.map((e) => (
          <div className='p-4 bg-muted/20 rounded-md border lg:hover:bg-muted/60 ease-in-out duration-200'>
            <div className='w-full items-center justify-between flex'>
              <Link href={`/${params.id}/collection/${e.id}`} className='flex items-start justify-start gap-3 w-max  flex-1'>
                <Icon className='scale-[1.7] mt-2' icon={`${e.image}`} />
                <div className=''>
                  <h3 className='font-semibold'>{useHelfText(`${e.name}`, 30)}
                    <span className='text-sm font-light text-foreground/60'>{" "} ({e._count.Document})</span>
                  </h3>
                  <p className='flex flex-row items-center justify-center gap-1  text-sm font-light text-foreground/60'>
                    <Clock size={13} />
                    {useTimeAgo(e.createdAt)}</p>
                </div>
              </Link>
              <CreateCollectionForm
                projectId={params.id}
                target={e}>
                <Button variant="outline" size={"icon"} className='bg-transparent rounded-full'>
                  <Settings size={20} />
                </Button>
              </CreateCollectionForm>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
