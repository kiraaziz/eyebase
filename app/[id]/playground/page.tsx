import { Suspense } from 'react'
import TestForm from '@/components/api/TestForm'
import { useGetCollections } from '@/hooks/getData/useGetCollections'

export const metadata = {
  title: 'Eyebase | Playground',
}


export default function page({ params }: { params: any }) {

  return (
    <Suspense fallback={<div className='w-full max-w-6xl mx-auto mt-10 '>
      <div className='flex items-center justify-between w-full mb-4'>
        <h1 className='text-2xl font-bold loader-animation h-7 w-48 rounded-lg'></h1>
      </div>
      <div className='w-full grid  lg:grid-cols-7 grid-cols-2 gap-3'>
        <h1 className='text-2xl font-bold loader-animation h-10 w-full rounded-lg col-span-2'></h1>
        <h1 className='text-2xl font-bold loader-animation h-10 w-full rounded-lg col-span-2'></h1>
        <h1 className='text-2xl font-bold loader-animation h-10 w-full rounded-lg col-span-2'></h1>
        <h1 className='text-2xl font-bold loader-animation h-10 w-full rounded-lg col-span-1'></h1>
        <h1 className='text-2xl font-bold loader-animation rounded-lg w-full h-72 col-span-full'></h1>
      </div>
    </div>}>
      <PageLoader params={params} />
    </Suspense>
  )
}

async function PageLoader({ params }: { params: any }) {

  const collections = await useGetCollections(params.id)
  return (
    <div className='w-full max-w-6xl mx-auto mb-10 '>
      <div className='flex items-center justify-between w-full mb-4'>
        <h1 className='text-2xl font-bold'>Playground</h1>
      </div>
      <div className='w-full '>
        <TestForm collections={collections} />
      </div>
    </div>
  )
}
