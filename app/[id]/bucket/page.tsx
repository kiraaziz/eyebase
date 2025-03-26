import CreateFile from '@/components/files/CreateFile'
import Empty from '@/components/global/Empty'
import ImageWithLoader from '@/components/global/ImageWithLoader'
import { Button } from '@/components/ui/button'
import { useGetFiles } from '@/hooks/useGet'
import { useHelfText } from '@/hooks/useState'
import { File, MoreHorizontal, Plus, UploadCloud } from 'lucide-react'
import { Suspense } from 'react'

export const metadata = {
  title: 'Eyebase | Storage bucket',
}


export default function page({ params }: { params: any }) {

  return (
    <Suspense fallback={<div className='w-full max-w-6xl mx-auto mt-10 gap-2' >
      <div className='flex items-center justify-between w-full mb-4'>
        <h1 className='text-2xl font-bold  h-9 w-48 rounded-lg loader-animation'></h1>
      </div>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2'>
        {[...Array(10)].map((e) => (
          <div className="p-2 border rounded-md bg-muted/40 backdrop-blur-xl loader-animation h-44" />
        ))}
      </div>
    </div>}>
      <PageLoader params={params} />
    </Suspense>
  )
}

async function PageLoader({ params }: { params: any }) {

  const files = await useGetFiles(params.id)

  if (files.length === 0) return <Empty title='No file created yet'>
    <CreateFile canRefrech={false} projectId={params.id}>
      <Button>
        <Plus size={20} />
        Upload file
      </Button>
    </CreateFile>
  </Empty>

  return (
    <div className='w-full max-w-6xl mx-auto mt-10 '>
      <div className='flex items-center justify-between w-full mb-4'>
        <h1 className='text-2xl font-bold'>Storage Bucket</h1>
        <CreateFile canRefrech={true} projectId={params.id}>
          <Button>
            <UploadCloud size={20} />
            Upload file
          </Button>
        </CreateFile>
      </div>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 text-sm'>
        {files.map((file: any) => (
          <div className="h-max p-2 border mt-2 rounded-md bg-muted/40 backdrop-blur-xl" key={file.id}>
            {file.type.startsWith("image/") ? <ImageWithLoader url={file.URL} /> :
              <div className='w-full rounded-md h-28 mb-3 flex items-center justify-center bg-primary/20' >
                <File size={24} className='text-primary' />
              </div>
            }
            <div className="w-full flex justify-center gap-2">
              <File size={16} />
              <div className="">
                <h1 className=" font-semibold text-foreground">
                  {useHelfText(file.name, 20)}
                </h1>
                <p className='text-foreground/60'>
                  {useHelfText(file.type, 20)}
                </p>
              </div>
              <div className="flex-1 justify-end flex">
                <CreateFile canRefrech={true} projectId={params.id} target_={file}>
                  <Button size="icon" className='bg-transparent' variant="outline">
                    <MoreHorizontal size={17} />
                  </Button>
                </CreateFile>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
