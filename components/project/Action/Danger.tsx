"use client"
import { GetProjectType } from '@/hooks/useGet'
import React, { useState } from 'react'
import { LogOut, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useFetch } from '@/hooks/useFecth'
import { useRouter } from 'next/navigation'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import LoadingButton from '@/components/global/LoadingButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Danger = ({ project, role }: { project: GetProjectType, role: string }) => {

    const router = useRouter()
    const [confierm, setConfierm] = useState(``)
    const [open, setOpen] = useState(false)
    const [isDelete, useDelete] = useFetch("/project", "DELETE", async(res) => {
        router.push("/app/?state=refrech")
    })

    const [isLeave, useLeave] = useFetch("/membership/leave", "DELETE", (res) => {
        router.push("/app/?state=refrech")
    })


    return (
        <>
            <AlertDialog open={open} onOpenChange={(e) => setOpen(e)} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Leave group</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to leave this group? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <LoadingButton variant="destructive" isLoading={isLeave} onClick={() => useLeave({ projectId: project?.id })}>
                            <LogOut size={20} />
                            Leave
                        </LoadingButton>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className='w-full space-y-3 mb-3'>
                <div className='flex flex-col'>
                    <div className={`mt-1 border rounded-md`}>
                        <div className="px-4 py-3">
                            <h1 className='text-2xl font-bold '>Leave group</h1>
                            <p className='text-sm  text-foreground/60 mb-3'> After leaving the group, you will no longer have access to its data unless the admin invites you back.</p>
                        </div>
                        <div className="w-full p-3 bg-muted/20 border-t border flex items-center justify-start">
                            <Button onClick={() => {
                                if (role === "admin") {
                                    toast.error("🥲 You are the admin of the group. You can't leave until you assign someone else as admin.");
                                } else {
                                    setOpen(true)
                                }
                            }} variant="outline" >
                                <LogOut size={16} />
                                Leave group
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <form onSubmit={(e) => e.preventDefault()} className={`mt-1 border rounded-md border-destructive ${role !== "admin" && "opacity-50 cursor-not-allowed"}`}>
                        <div className="px-4 py-3">
                            <h1 className='text-2xl font-bold '>Delete project</h1>
                            <p className='text-sm  text-foreground/60 mb-3'>Once you delete a project, this action cannot be undone, and all related information will be permanently erased.</p>
                            <Input className='focus-visible:ring-destructive' value={confierm} onChange={(e) => setConfierm(e.target.value)} placeholder='type "DELETE" to delete project' />
                        </div>
                        <div className="w-full p-3 bg-destructive/20 border-t border-destructive flex items-center justify-end">
                            <LoadingButton type='submit' disabled={role !== "admin"} isLoading={isDelete} onClick={async () => {
                                if (confierm.trim() === "DELETE") {
                                    await useDelete({ projectId: project?.id })
                                } else {
                                    toast.error("🥲 The confirmation text is incorrect.");
                                }
                            }} variant="destructive" >
                                <Trash2 size={16} />
                                Delete project
                            </LoadingButton>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

