import Loader from '@/components/global/Loader'
import Settings from '@/components/project/Settings'
import { useGetProject, useGetRole } from '@/hooks/useGet'
import React, { Suspense } from 'react'

 
export const metadata = {
  title: 'Eyebase | Settings',
}
 

export default function page({ params }: { params: any }) {

  return (
    <Suspense fallback={<div className="p-5 flex items-center justify-center min-h-[80svh]">
      <Loader />
    </div>}>
      <PageLoader params={params} />
    </Suspense>
  )
}

async function PageLoader({ params }: { params: any }) {

  const project = await useGetProject(params.id)
  const membership = await useGetRole(params.id)

  return (
    <div className='w-full max-w-6xl mx-auto mt-10 '>
      <div className='flex items-center justify-between w-full mb-4'>
        <h1 className='text-2xl font-bold'>Settings</h1>
      </div>
      <Settings project={project} membership={membership} />
    </div>
  )
}
