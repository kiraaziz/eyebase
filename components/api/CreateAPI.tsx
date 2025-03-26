"use client"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useFetch } from "@/hooks/useFecth"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { setState } from "@/hooks/useState"
import LoadingButton from "../global/LoadingButton"
import { Check, Copy, Save, Trash2 } from "lucide-react"
import { Input } from "../ui/input"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

export default function CreateAPI({ projectId, target, collections, children, isEmpty = false }: any) {

    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [openDel, setOpenDel] = useState(false)
    const [openKey, setOpenKey] = useState(false)
    const [keyCode, setKeyCode] = useState(null)

    const [isUpdate, useUpdate] = useFetch("/key", "PUT", (res) => {
        setOpen(false)
        setOpenKey(true)
        setKeyCode(res.apiKey.key)
    })
    const [isDelete, useDelete] = useFetch("/key", "DELETE", () => {
        setOpenDel(false)
        setOpen(false)
    })
    const [isCreate, useCreate] = useFetch("/key", "POST", (res) => {
        setOpen(false)
        setOpenKey(true)
        setKeyCode(res.apiKey.key)
    }, !isEmpty)

    const [key, setKey] = useState<any>({
        projectId: projectId,
        name: "",
        collections: []
    })

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(`${keyCode}`)
            toast.success("✨🎉API key copied to your clipboard!")
            setOpenDel(false)
            setOpenKey(false)
            setOpen(false)
            if (isEmpty) {
                router.refresh()
            }
        } catch (error) {
            toast.error("🥲 Failed to copy text: " + error)
        }
    }

    return (
        <>
            <AlertDialog open={openKey} onOpenChange={(e) => {
                setOpenKey(e)
                if (!e && isEmpty) {
                    router.refresh()
                }
            }} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Copy your API key</AlertDialogTitle>
                        <AlertDialogDescription>
                            <Input value={`${keyCode}`} disabled />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button onClick={copyToClipboard}>
                            <Copy size={20} />
                            Copy
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={openDel} onOpenChange={(e) => setOpenDel(e)} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Collection</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this api key? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <LoadingButton variant="destructive" isLoading={isDelete} onClick={() => useDelete({ id: target.id, ...key })}>
                            <Trash2 size={20} />
                            Delete
                        </LoadingButton>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Dialog open={open} onOpenChange={(e) => {
                if (e) {
                    if (collections.length === 0) {
                        toast.error("🥲 You don't have any collections created yet")
                    } else {
                        setKey({
                            projectId: projectId,
                            name: target ? target.name : "",
                            key: target ? target.key : "",
                            collections: target ? target.permissions.map((v: any) => {
                                return {
                                    colId: v.collectionId,
                                    ...v
                                }
                            }) : []
                        })
                        setOpen(e)
                    }
                } else {
                    setOpen(e)
                }

            }}>
                <DialogTrigger className={`${collections.length === 0 && "opacity-60"}`} asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="overflow-auto max-h-[90svh]">
                    <DialogHeader>
                        <DialogTitle className="flex ">
                            Create your API key
                        </DialogTitle>
                        <DialogDescription className=" py-4">
                            <Input placeholder="Key name..." className="mb-3" value={key.name} onChange={(e) => setState(setKey, "name", e.target.value)} />
                            <Select onValueChange={(e) => {
                                const existingIndex = key.collections.findIndex((col: any) => col.colId === e)

                                if (existingIndex !== -1) {
                                    const updatedCollections = [
                                        ...key.collections.slice(0, existingIndex),
                                        ...key.collections.slice(existingIndex + 1)
                                    ]
                                    setState(setKey, "collections", updatedCollections)
                                } else {
                                    setState(setKey, "collections", [...key.collections, {
                                        colId: e,
                                        canList: false,
                                        canRead: false,
                                        canCreate: false,
                                        canUpdate: false,
                                        canDelete: false,
                                    }])
                                }
                            }}>
                                <SelectTrigger className="w-full">
                                    {key.collections.length === 0 ? "Select collection" : "Collections"}
                                </SelectTrigger>
                                <SelectContent>
                                    {collections.map((col: any) => (
                                        <SelectItem className="hover:bg-muted hover:cursor-pointer" value={col.id} hideCheck={true}>
                                            <div className=" flex items-center  gap-1 flex-row">
                                                {(key.collections.findIndex((v: any) => v.colId === col.id) > -1) && <Check className="h-4 w-4" />}
                                                {col.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {key.collections.map((col: any) => (
                                <div className="mt-4 space-y-3 p-3 px-5 bg-muted/20 rounded-lg">
                                    <h1 className="font-medium">
                                        {collections[key.collections.findIndex((v: any) => v.colId === col.colId)].name}
                                    </h1>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["can-List", "can-Read", "can-Create", "can-Update", "can-Delete"].map((effect) => (
                                            <div onClick={() => setState(setKey, "collections", key.collections.map((v: any) => {
                                                if (v.colId !== col.colId) return v
                                                return {
                                                    ...v,
                                                    [effect.replace("-", "")]: !v[effect.replace("-", "")]
                                                }
                                            }))} className="hover:cursor-pointer flex items-center justify-center w-max gap-2">
                                                <Checkbox checked={col[effect.replace("-", "")]} />
                                                {effect.replace("can-", "")}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </DialogDescription>
                        <DialogFooter>
                            {target ?
                                <>
                                    <LoadingButton isLoading={isUpdate} onClick={() => useUpdate({ id: target.id, ...key })}>
                                        <Save size={20} />
                                        Update
                                    </LoadingButton>
                                    <LoadingButton variant="destructive" isLoading={false} onClick={() => setOpenDel(true)}>
                                        <Trash2 size={20} />
                                        Delete
                                    </LoadingButton>
                                </>
                                : <LoadingButton isLoading={isCreate} onClick={() => useCreate(key)}>
                                    <Save size={20} />
                                    Create
                                </LoadingButton>}
                        </DialogFooter>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}
