import { Database, File, Fingerprint, Globe } from 'lucide-react'
import { Suspense } from 'react'
import GlobalChart from '@/components/Home/GlobalChart'
import { useSizeConvert } from '@/hooks/useState'
import { useGetHomeState } from '@/hooks/getData/useGetHomeState'

export const metadata = {
  title: 'Eyebase | Dashboard',
}

export default function page({ params, searchParams }: any) {

  return (
    <Suspense key={JSON.stringify(searchParams)} fallback={<div className="w-full max-w-6xl mx-auto mt-10 ">
      <div className="flex items-center justify-between w-full mb-4">
        <h1 className='text-2xl font-bold skeleton-box h-9 w-48 rounded-lg loader-animation'></h1>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-2">
        <div className="p-4 rounded-lg loader-animation h-20" />
        <div className="p-4 rounded-lg loader-animation h-20" />
        <div className="p-4 rounded-lg loader-animation h-20" />
        <div className="p-4 rounded-lg loader-animation h-20" />
        <div className="p-4 rounded-lg loader-animation col-span-1 lg:col-span-4 h-96" />
      </div>
    </div>}>
      <PageLoader params={params} searchParams={searchParams} />
    </Suspense>
  )
}

async function PageLoader({ params, searchParams }: any) {

  const period = ["7d", "30d", "90d"].includes(searchParams.period) ? searchParams.period : "30d"
  const {
    totalRequests,
    totalCollections,
    totalDoc,
    totalStorage,
    activities
  } = await useGetHomeState(params.id, period)

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 ">
      <div className="flex items-center justify-between w-full mb-4">
        <h1 className="text-2xl font-bold">Home</h1>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-2">
        <div className="p-4 rounded-lg border bg-muted/20 grid-cols-1">
          <div className="flex items-center justify-between">
            <h1 className="text-sm">Total collections</h1>
            <Database size={19} className="text-foreground/70" />
          </div>
          <h1 className="text-xl font-bold mt-1">{totalCollections}</h1>
        </div>
        <div className="p-4 rounded-lg border bg-muted/20 grid-cols-1">
          <div className="flex items-center justify-between">
            <h1 className="text-sm">Total Documents</h1>
            <Fingerprint size={19} className="text-foreground/70" />
          </div>
          <h1 className="text-xl font-bold mt-1">{totalDoc}</h1>
        </div>
        <div className="p-4 rounded-lg border bg-muted/20 grid-cols-1">
          <div className="flex items-center justify-between">
            <h1 className="text-sm">Used storage</h1>
            <File size={19} className="text-foreground/70" />
          </div>
          <h1 className="text-xl font-bold mt-1">{useSizeConvert(totalStorage._sum.size || 0)}</h1>
        </div>
        <div className="p-4 rounded-lg border bg-muted/20 grid-cols-1">
          <div className="flex items-center justify-between">
            <h1 className="text-sm">Total request</h1>
            <Globe size={19} className="text-foreground/70" />
          </div>
          <h1 className="text-xl font-bold mt-1">{totalRequests}</h1>
        </div>
        <GlobalChart activities={activities} projectId={params.id} duration={period} />
      </div>
    </div>
  )
}
