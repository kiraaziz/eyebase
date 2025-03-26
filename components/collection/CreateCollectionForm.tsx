"use client"
import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Check, ChevronLeft, Compass, Save, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import debounce from 'lodash/debounce'
import { Icon } from '@iconify/react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '../ui/input'
import LoadingButton from '../global/LoadingButton'
import { toast } from 'sonner'
import { useFetch } from '@/hooks/useFecth'
import { setState } from '@/hooks/useState'
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
import Link from 'next/link'

export { Icon }
export default function CreateCollectionForm({ projectId, target, children }: { projectId: string, target: null | any, children: React.ReactNode }) {

    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [openDel, setOpenDel] = useState(false)
    const [showIcon, setShowIcon] = useState(false)
    const [collectionData, setCollectionData] = useState({
        projectId: projectId,
        name: "",
        image: "fluent-color:person-24",
    })

    const [isUpdate, useUpdate] = useFetch("/collection", "PUT", () => { setOpen(false) })
    const [isDelete, useDelete] = useFetch("/collection", "DELETE", () => { setOpen(false) })
    const [isCreate, useCreate] = useFetch("/collection", "POST", () => { setOpen(false) })

    return (
        <>
            <AlertDialog open={openDel} onOpenChange={(e) => setOpenDel(e)} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Collection</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this collection? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <LoadingButton variant="destructive" isLoading={isDelete} onClick={() => useDelete({ id: target.id, ...collectionData })}>
                            <Trash2 size={20} />
                            Delete
                        </LoadingButton>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={open} onOpenChange={(e) => {
                setOpen(e)
                setShowIcon(false)
                setCollectionData({
                    projectId: projectId,
                    name: target ? target.name : "",
                    image: target ? target.image : "fluent-color:person-24",
                })
            }}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent >
                    {!showIcon && <DialogHeader>
                        <DialogTitle className="flex">
                            {target ? "Update" : "Create"} Your Collection
                        </DialogTitle>
                        <p className="text-sm text-foreground/60 font-light">
                            Easily add a collection and connect via API
                        </p>
                    </DialogHeader>}
                    <DialogDescription className='h-max '>
                        {showIcon ?
                            <>
                                <Button onClick={() => setShowIcon(false)} variant="outline" className='mb-2'>
                                    <ChevronLeft />
                                    Back
                                </Button>
                                <IconsInput setShowIcon={setShowIcon} icon={collectionData.image} setIcon={(e: any) => setCollectionData((pre) => {
                                    return {
                                        ...pre,
                                        image: e
                                    }
                                })} />
                            </>
                            : <div className="w-full flex flex-row mt-3">
                                <Button onClick={() => setShowIcon(true)} className='border-none h-24 w-24 overflow-hidden' variant="outline">
                                    <Icon className='scale-[3.5]' icon={collectionData.image} />
                                </Button>
                                <form onSubmit={(e) => e.preventDefault()} className='flex-1 ml-2 space-y-2'>
                                    <Input
                                        autoFocus={true}
                                        value={collectionData.name}
                                        onChange={(e) => setState(setCollectionData, "name", e.target.value)}
                                        placeholder='collection name ...' />
                                    <div className='flex items-center justify-end gap-1 flex-row w-full'>

                                        {target ?
                                            <>
                                                {target && <Link href={`/${projectId}/collection/${target.id}`} className='mr-auto'>
                                                    <Button variant={"outline"} >
                                                        <Compass size={20} />
                                                        Explore
                                                    </Button>
                                                </Link>}
                                                <LoadingButton type="submit" isLoading={isUpdate} onClick={() => useUpdate({ id: target.id, ...collectionData })}>
                                                    <Save size={20} />
                                                    Update
                                                </LoadingButton>
                                                <LoadingButton variant="destructive" isLoading={false} onClick={() => setOpenDel(true)}>
                                                    <Trash2 size={20} />
                                                    Delete
                                                </LoadingButton>

                                            </>
                                            : <LoadingButton type="submit" isLoading={isCreate} onClick={() => useCreate(collectionData)}>
                                                <Save size={20} />
                                                Create
                                            </LoadingButton>}
                                    </div>
                                </form>

                            </div>}
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </>
    )
}



const IconsInput = ({ icon, setIcon, setShowIcon }: any) => {

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(icon)
    const [isSearching, starSearching] = useTransition()

    const [icons, setIcons] = useState<any>([
        "solar:t-shirt-outline",
        "ph:pizza-duotone",
        "mdi:drink-outline",
        "solar:washing-machine-linear",
    ])

    const fetchIcons = async (query: string) => {
        try {
            const response = await fetch(`https://api.iconify.design/search?query=${query.replaceAll(" ", "-")}`)
            const data = await response.json()
            if (data && data.icons) {
                setIcons(data.icons)
            }
        } catch (error) {
            toast.error('Error fetching icons: ' + error)
        }
    }

    const debouncedFetchIcons = useCallback(debounce((query: any) => {
        starSearching(() => fetchIcons(query))
    }, 300), [])

    useEffect(() => {
        if (value) {
            debouncedFetchIcons(value)
        }
    }, [value, debouncedFetchIcons])

    const highlightText = (text: string, highlight: string) => {
        if (!highlight.trim()) {
            return text
        }

        const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
        return (
            <span>
                {parts.map((part: any, index: any) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <span key={index} className='text-white bg-primary'>{part}</span>
                    ) : (
                        part
                    )
                )}
            </span>
        )
    }

    return (
        <Command>
            <CommandInput isLoad={isSearching} autoFocus onValueChange={(e: string) => setValue(e)} value={value} placeholder='icon name...' />
            <CommandEmpty>No icons found</CommandEmpty>
            <CommandGroup className='max-h-60 overflow-auto'>
                {icons.map((icon_: any) => (
                    <CommandItem
                        key={icon_}
                        value={icon_}
                        onSelect={(currentValue) => {
                            setIcon(currentValue)
                            setOpen(false)
                            setShowIcon(false)
                        }}
                    >
                        <Check
                            className={cn(
                                "mr-2 h-4 w-4",
                                icon === icon_ ? "opacity-100" : "opacity-0"
                            )}
                        />

                        <Icon className='scale-[1.4]' icon={icon_} />
                        <p className='ml-3 text-sm text-foreground/80'>
                            {highlightText(icon_.replaceAll("-", " "), value)}
                        </p>
                    </CommandItem>
                ))}
            </CommandGroup>
        </Command>

    )
}

