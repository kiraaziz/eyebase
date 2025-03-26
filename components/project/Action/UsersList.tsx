"use client"
import { GetProjectType } from '@/hooks/useGet'
import React, { useState } from 'react'
import { Crown, Eye, Loader2, MoreHorizontal, Pen, Send, Trash2, UserPlus } from 'lucide-react'
import { setState, useHelfText } from '@/hooks/useState'
import { useFetch } from '@/hooks/useFecth'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTimeAgo } from '@/hooks/useTime'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import LoadingButton from '@/components/global/LoadingButton'

export const UserList = ({ project, role }: { project: GetProjectType, role: string }) => {

    const [openAd, setOpenAd] = useState(false)
    const [openDel, setOpenDel] = useState(false)
    const [target, setTraget] = useState<any>({})

    const [isUpdate, useUpdate] = useFetch("/membership", "PUT", (res) => {
        setTraget({})
    })

    const handleAction = (e: string, id: string) => {
        setTraget({ memberId: id, action: e, projectId: project?.id })
        if (e === "delete") {
            setOpenDel(true)
        } else if (e === "admin") {
            setOpenAd(true)
        } else {
            useUpdate({ memberId: id, action: e, projectId: project?.id })
        }
    }

    return (
        <>
            <AlertDialog open={openDel} onOpenChange={(e) => setOpenDel(e)} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete memeber</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this member? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button variant="destructive" onClick={async () => {
                            setOpenDel(false)
                            await useUpdate(target)
                        }}>
                            <Trash2 size={20} />
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={openAd} onOpenChange={(e) => setOpenAd(e)} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Update to admin</AlertDialogTitle>
                        <AlertDialogDescription>
                            Once you update them to Admin, you will become an Editor and lose your Admin permissions for this member.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button variant="default" onClick={async () => {
                            setOpenAd(false)
                            await useUpdate(target)
                        }}>
                            <Crown size={20} />
                            Update to admin
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className='w-full space-y-3 mb-3 '>
                <div className='w-full flex items-center mb-2 justify-between'>
                    <h4 className='text-base font-semibold'>Members</h4>
                    {role === "admin" && <AddMember projectId={project?.id || ""} />}
                </div>
                <div className='w-full border rounded-lg  gap-2 overflow-hidden'>
                    <Table className='w-full bg-muted/20 backdrop-blur-xl'>
                        <TableHeader className='bg-muted '>
                            <TableRow className=''>
                                <TableHead></TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Join at</TableHead>
                                {role === "admin" && <TableHead>Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {project?.membership.map((member) => (
                                <TableRow>
                                    <TableCell>
                                        {member.user ? <>
                                            <Avatar className="outline-none">
                                                <AvatarImage src={member.user.image || ""} className="object-cover" />
                                                <AvatarFallback>{(member.user.name || "").slice(0, 2)}</AvatarFallback>
                                            </Avatar>
                                        </>
                                            : <Avatar className="outline-none">
                                                <AvatarFallback>{(member.tempMail || "").slice(0, 2)}</AvatarFallback>
                                            </Avatar>}
                                    </TableCell>
                                    <TableCell>
                                        {member.user ? <>
                                            <h1 className='font-semibold'>{useHelfText((member.user.name || ""), 30)}</h1>
                                            <p className='text-foreground/60 text-sm'>{useHelfText((member.user.email || ""), 30)}</p>
                                        </>
                                            : <>
                                                <h1 className='flex items-center justify-center gap-2 text-xs w-max bg-muted rounded-full border px-3'>
                                                    <Send size={12} />
                                                    Invitaion sended</h1>
                                                <p className='text-foreground/60 text-sm'>{useHelfText((member.tempMail || ""), 30)}</p>
                                            </>}
                                    </TableCell>
                                    <TableCell>
                                        <RoleSwitcher role={member.role || ""} />
                                    </TableCell>
                                    <TableCell className='text-foreground/60 text-xs'>
                                        {useTimeAgo(member.createdAt)}
                                    </TableCell>
                                    {role === "admin" && <TableCell className='flex items-center justify-center'>
                                        {(isUpdate && (target.memberId === member.id)) && <Button disabled={true} variant={"outline"} size={"icon"} className='mx-auto rounded-full bg-transparent border-none pointer-events-auto'>
                                            <Loader2 size={18} className='animate-spin m-auto ' />
                                        </Button>}
                                        {member.role !== "admin" && !(isUpdate && (target.memberId === member.id)) && <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button disabled={isUpdate} variant={"outline"} size={"icon"} className='disabled:cursor-not-allowed mx-auto rounded-full bg-transparent border-none pointer-events-auto'>
                                                    <MoreHorizontal size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="m-3">
                                                <DropdownMenuLabel>Update role</DropdownMenuLabel>
                                                {["admin", "editor", "viewer"].map((el) => (
                                                    (el !== member.role) && <DropdownMenuItem onClick={() => handleAction(el, member.id)} className="gap-1 hover:gap-2 hover:cursor-pointer ease-in-out duration-200 transition-all hover:bg-muted text-foreground/60" >
                                                        {el === "admin" && <>
                                                            <Crown size={12} />
                                                            Admin
                                                        </>}
                                                        {el === "editor" && <>
                                                            <Pen size={12} />
                                                            Editor
                                                        </>}
                                                        {el === "viewer" && <>
                                                            <Eye size={12} />
                                                            Viewer
                                                        </>}
                                                    </DropdownMenuItem>
                                                ))}

                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleAction("delete", member.id)} className="gap-1 text-destructive hover:gap-2 hover:cursor-pointer hover:!bg-destructive/10 hover:!text-destructive ease-in-out duration-200 transition-all" >
                                                    <Trash2 size={18} />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        }
                                    </TableCell>}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}


export default function AddMember({ projectId }: { projectId: string }) {

    const [open, setOpen] = useState(false)
    const [memberData, setMemberData] = useState({
        projectId: projectId,
        email: "",
        role: "viewer",
    })

    const [isCreate, useCreate] = useFetch("/membership", "POST", () => {
        setState(setMemberData, "email", "")
        setOpen(false)
    })

    return (
        <Dialog open={open} onOpenChange={(e) => {
            setOpen(e)
        }}>
            <DialogTrigger asChild>
                <Button className='pointer-events-auto'>
                    <UserPlus size={18} />
                    Invite member
                </Button>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle className="flex">
                        Invite memeber
                    </DialogTitle>
                    <p className="text-sm text-foreground/60 font-light">
                        Add the user's email, and they will receive an invitation to join the team via email.
                    </p>
                </DialogHeader>
                <DialogDescription className='h-max '>
                    <form onSubmit={(e) => e.preventDefault} className='w-full'>
                        <Input autoFocus type='email' placeholder='someone@emaple.com' value={memberData.email} onChange={(e) => setState(setMemberData, "email", e.target.value)} />
                        <Select value={memberData.role} onValueChange={(e: any) => setState(setMemberData, "role", e)}>
                            <SelectTrigger className="w-full my-2">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem className="hover:bg-muted   text-foreground/60 hover:text-foreground" value={"viewer"}>
                                    <div className='flex flex-row w-max items-center justify-center gap-2'>
                                        <Eye size={16} />
                                        Viewer
                                    </div>
                                </SelectItem>
                                <SelectItem className="hover:bg-muted   text-foreground/60 hover:text-foreground" value={"editor"}>
                                    <div className='flex flex-row w-max items-center justify-center gap-2'>
                                        <Pen size={16} />
                                        Editor
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <div className='w-full items-center justify-end flex'>
                            <LoadingButton type='submit' isLoading={isCreate} onClick={async () => await useCreate(memberData)}>
                                <UserPlus size={18} />
                                Invite
                            </LoadingButton>
                        </div>
                    </form>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}


export const RoleSwitcher = ({ role }: { role: string }) => {

    if (role === "editor") return <div className='bg-secondary/20 text-xs text-secondary flex items-center justify-center gap-1 rounded-full border border-secondary py-0.5'>
        <Pen size={12} />
        Editor
    </div>

    if (role === "viewer") return <div className='bg-blue-500/20 text-xs text-blue-500 flex items-center justify-center gap-1 rounded-full border border-blue-500  py-0.5'>
        <Eye size={12} />
        Viewer
    </div>


    if (role === "admin") return <div className='bg-primary/20 text-xs text-primary flex items-center justify-center gap-1 rounded-full border border-primary  py-0.5'>
        <Crown size={12} />
        Admin
    </div>

    return null
}


