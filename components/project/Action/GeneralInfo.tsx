"use client"
import { GetProjectType } from '@/hooks/useGet'
import React, { useState } from 'react'
import { Copy, SaveAll } from 'lucide-react'
import LoadingButton from '@/components/global/LoadingButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useFetch } from '@/hooks/useFecth'


export const GeneralInfo = ({ project, role }: { project: GetProjectType, role: string }) => {

    const [name, setName] = useState(`${project?.name}`)
    const [isUpdate, useUpdate] = useFetch("/project", "PUT", (res) => { })

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(project?.id || "")
            toast.success("✨🎉Project ID copied to your clipboard!")
        } catch (error) {
            toast.error("🥲 Failed to copy text: " + error)
        }
    }

    return (
        <div className='w-full space-y-3 mb-3 '>
            <form onSubmit={(e) => e.preventDefault()} className='flex flex-col'>
                <div className="mt-1 border rounded-md">
                    <div className="px-4 py-3">
                        <h1 className='text-2xl font-bold '>Project name</h1>
                        <p className='text-sm  text-foreground/60 mb-3'></p>
                        <Input disabled={role !== "admin"} autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder='project name' />
                    </div>
                    <div className="w-full p-3 bg-muted/20 border-t">
                        <LoadingButton variant="outline" disabled={role !== "admin"} type='submit' className={`mt-2 w-max min-w-20 ${role !== "admin" && "cursor-not-allowed"}`} isLoading={isUpdate} onClick={async () => await useUpdate({ name: name, projectId: project?.id })}>
                            <SaveAll size={20} />
                            Update
                        </LoadingButton>
                    </div>
                </div>
            </form>
            <div className='flex flex-col'>
                <div className="mt-1 border rounded-md">
                    <div className="px-4 py-3">
                        <h1 className='text-2xl font-bold '>Project ID</h1>
                        <p className='text-sm  text-foreground/60 mb-3'> If you encounter any issues or need assistance, please contact the admin using this unique ID.</p>
                        <Input value={project?.id} disabled />
                    </div>
                    <div className="w-full p-3 bg-muted/20 border-t">
                        <Button onClick={copyToClipboard} variant="outline" className="px-6">
                            <Copy size={16} />
                            Copy project ID
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}


