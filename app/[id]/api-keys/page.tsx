import { Button } from '@/components/ui/button'
import { AlertTriangle, MoreHorizontal, Plus } from 'lucide-react'
import React, { Suspense } from 'react'
import { Icon } from '@/components/collection/CreateCollectionForm'
import { useGetKeys } from '@/hooks/getData/useGetKeys'
import { useGetCollections } from '@/hooks/getData/useGetCollections'
import { useTimeAgo } from '@/hooks/useTime'
import Empty from '@/components/global/Empty'
import CreateAPI from '@/components/api/CreateAPI'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from '@/lib/utils'
import KeyCode from '@/components/api/KeyCode'
import { useHelfText } from '@/hooks/useState'

export const metadata = {
  title: 'Eyebase | API keys',
}

export default function page({ params }: { params: any }) {

  return (
    <Suspense fallback={<div className='w-full max-w-6xl mx-auto mt-10'>
      <div className='flex items-center justify-between w-full mb-4 gap-2'>
        <h1 className='text-2xl font-bold  h-9 w-48 rounded-lg loader-animation'></h1>
      </div>
      <div className='w-full border rounded-lg  gap-2 overflow-hidden'>
        <Table className='w-full bg-muted/20 backdrop-blur-xl'>
          <TableHeader className='bg-muted/40'>
            <TableRow className=''>
              <TableHead>
              </TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='overflow-hidden'>
            {[...Array(10)].map((k: any) => (
              <TableRow className='overflow-hidden'>
                <TableCell>
                  <h1 className='text-2xl font-bold loader-animation h-5 w-36 rounded-lg'></h1>
                </TableCell>
                <TableCell>
                  <h1 className='text-2xl font-bold loader-animation h-5 w-44 rounded-lg'></h1>
                </TableCell>
                <TableCell>
                  <div className=' px-5 gap-2 text-sm font-light bg-muted/40 rounded-full py-1 border text-foreground/60 h-8 w-20 flex items-center justify-center loader-animation '></div>
                </TableCell>
                <TableCell>
                  <div className='w-full flex flex-wrap gap-1  max-w-52'>
                    {[...Array(Math.floor(Math.random() * 5) + 1)].map((effect: any) => (
                      <div className={cn("loader-animation  h-5 w-14 text-foreground/60  text-xs border px-4 rounded-full  flex items-center justify-center gap-2 ")}></div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <h1 className='text-2xl font-bold loader-animation h-5 w-36 rounded-lg'></h1>
                </TableCell>
                <TableCell>
                  {/* <h1 className='text-2xl font-bold loader-animation h-10 w-10 rounded-full'></h1> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>}>
      <PageLoader params={params} />
    </Suspense>
  )
}

async function PageLoader({ params }: { params: any }) {

  const collections = await useGetCollections(params.id)
  const keys = await useGetKeys(params.id)

  if (keys.length === 0) return <Empty title='No keys created yet'>
    <CreateAPI
      collections={collections}
      projectId={params.id}
      isEmpty={true}
    >
      <Button>
        <Plus size={20} />
        New API Key
      </Button>
    </CreateAPI>
  </Empty>

  return (
    <div className='w-full max-w-6xl mx-auto mt-10'>
      <div className='flex items-center justify-between w-full mb-4'>
        <h1 className='text-2xl font-bold'>API keys</h1>
        <CreateAPI
          collections={collections}
          projectId={params.id}
        >
          <Button>
            <Plus size={20} />
            New API Key
          </Button>
        </CreateAPI>
      </div>
      <div className='w-full border rounded-lg  gap-2 overflow-hidden'>
        <Table className='w-full'>
          <TableHeader className='bg-muted/40'>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Secret key</TableHead>
              <TableHead>Collection</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((k: any, index: any) => (
              <TableRow className={`${true && "border-b"}`}>
                <TableCell>{useHelfText(k.name, 30)}</TableCell>
                <TableCell>
                  <KeyCode code={k.key} />
                </TableCell>
                <TableCell>
                  <div className='w-full flex flex-wrap gap-1'>
                    {k.permissions && k.permissions
                      .sort((a: any, b: any) => new Date(b.collection.createdAt).getTime() - new Date(a.collection.createdAt).getTime())
                      .map((v: any) => (
                        <div className='w-max px-3 gap-2 bg-muted/40 rounded-full py-0.5 border text-foreground/60  flex items-center justify-center text-xs font-light'>
                          <Icon className='scale-[1]' icon={`${v.collection.image}`} />
                          {v.collection.name}
                        </div>
                      ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className='w-full flex flex-wrap gap-1'>
                    <PermissionsDisplay permissions={k.permissions} />
                  </div>
                </TableCell>
                <TableCell className='text-foreground/60 font-light'>{useTimeAgo(k.createdAt)}</TableCell>
                <TableCell>
                  <CreateAPI
                    collections={collections}
                    projectId={params.id}
                    target={k}
                  >
                    <Button variant={"outline"} className='rounded-full border-none bg-transparent' size={"icon"}>
                      <MoreHorizontal size={20} />
                    </Button>
                  </CreateAPI>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


const PermissionsDisplay = ({ permissions }: any) => {
  const permissionTypes = ["canList", "canRead", "canCreate", "canUpdate", "canDelete"]

  const colorClasses: any = {
    "List": "bg-blue-500/5 text-blue-500 border border-blue-500/20",
    "Create": "bg-green-500/5 text-green-500 border border-green-500/20",
    "Read": "bg-purple-500/5 text-purple-500 border border-purple-500/20",
    "Update": "bg-yellow-500/5 text-yellow-500 border border-yellow-500/20",
    "Delete": "bg-red-500/5 text-red-500 border border-red-500/20"
  }

  if (!permissions || permissions.length === 0) {
    return (
      <div className="bg-muted/40 text-foreground/60 text-xs border px-4 rounded-full flex items-center justify-center w-max gap-2">
        <AlertTriangle size={12} />
        No permissions
      </div>
    )
  }

  return (
    <div className='w-full flex flex-wrap gap-1  max-w-52'>
      {permissionTypes.map((effect: any) => (
        [...permissions.filter((per: any) => { return per[effect] })].length > 0 && <div className={cn(colorClasses[effect.replace("can", "")], "px-2 gap-1.5 py-0.5 text-xs font-light rounded-full  flex items-center justify-center w-max ")}>
          <div className='flex flex-row gap-0.5'>
            {permissions.filter((per: any) => { return per[effect] }).map((perm: any) => (
              <Icon className='scale-[1] ' icon={`${perm.collection.image}`} />
            ))}
          </div>
          {effect.replace("can", "").toLowerCase()}
        </div>))}
    </div>
  )
}