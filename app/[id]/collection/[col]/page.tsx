import CreateDocument, { JsonViewer } from '@/components/collection/CreateDocument'
import Empty from '@/components/global/Empty'
import { Button } from '@/components/ui/button'
import { useGetDocuments } from '@/hooks/getData/useGetDocuments'
import { useTimeAgo } from '@/hooks/useTime'
import { Clock, Edit3, Plus } from 'lucide-react'
import { Suspense } from 'react'

export const metadata = {
    title: 'Eyebase | Documents',
  }
 
  
export default function page({ params }: { params: any }) {

    return (
        <Suspense fallback={<div className='w-full max-w-6xl mx-auto mt-10'>
            <div className='flex items-center justify-between w-full mb-4 gap-2'>
              <h1 className='text-2xl font-bold skeleton-box h-9 w-48 rounded-lg loader-animation'></h1>
            </div>
            <div className='w-full grid grid-cols-1 md:grid-cols-2  gap-2'>
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

    const documents = await useGetDocuments(params.id, params.col)

    if (documents.length === 0) return <Empty title='No document created yet'>
        <CreateDocument
            projectId={params.id}
            colId={params.col}
            target={null}>
            <Button>
                <Plus size={20} />
                New document
            </Button>
        </CreateDocument>
    </Empty>

    return (
        <div className='w-full max-w-6xl mx-auto mt-10 '>
            <div className='flex items-center justify-between w-full mb-4'>
                <h1 className='text-2xl font-bold'>Documents</h1>
                <CreateDocument
                    projectId={params.id}
                    colId={params.col}
                    target={null}>
                    <Button>
                        <Plus size={20} />
                        New document
                    </Button>
                </CreateDocument>
            </div>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2'>
                {documents.map((e) => (
                    <div className='p-4 bg-muted/40 rounded-md border'>
                        <div className='w-full items-center justify-between flex'>
                            <div className='flex items-start justify-start gap-3 w-max flex-1'>
                                <div className='flex items-start justify-start flex-col'>
                                    <h3 className='font-semibold'>{e.id}
                                    </h3>
                                    <p className='flex flex-row items-center justify-center gap-1  text-sm font-light text-foreground/60'>
                                        <Clock size={13} />
                                        {useTimeAgo(e.createdAt)}</p>
                                </div>
                            </div>
                            <CreateDocument
                                projectId={params.id}
                                colId={params.col}
                                target={e}
                            >
                                <Button variant="outline" size={"icon"} className='bg-transparent rounded-full'>
                                    <Edit3 size={18} />
                                </Button>
                            </CreateDocument>
                        </div>
                        <JsonViewer json={JSON.parse(e.content ? JSON.stringify(e.content) : "{}")} />
                    </div>
                ))}
            </div>
        </div>
    )
}
