"use client"
import { useState, useTransition } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Copy, DiameterIcon, File, Link2, Save, Trash, UploadCloud } from "lucide-react"
import { setState, useHelfText, useSizeConvert } from "@/hooks/useState"
import { Switch } from "../ui/switch"
import LoadingButton from "../global/LoadingButton"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useFetch } from "@/hooks/useFecth"

export default function CreateFile({ projectId, target_, children, canRefrech }: any) {

    const router = useRouter()

    const [target, setTraget] = useState<any>(null)
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState(null)
    const [isImage, setIsImage] = useState(false)
    const [ext, setExt] = useState("")
    const [previewURL, setPreviewURL] = useState<any>(null)
    const [metaData, setMetaData] = useState<any>(null)
    const [optimze, setOptimze] = useState(true)

    const [isPending, startTransition] = useTransition()

    const [isDelete, useDelete] = useFetch("/bucket", "DELETE", () => {
        setOpen(false)
        setTraget(null)
        setPreviewURL(null)
        setIsImage(false)
        setExt("")
        setMetaData(null)
    })


    const handleFileChange = (event: any) => {
        const selectedFile = event.target.files[0]
        setFile(selectedFile)
        setExt(selectedFile.name.split('.').pop())
        setIsImage(selectedFile && selectedFile.type.startsWith('image/'))
        setPreviewURL(URL.createObjectURL(selectedFile))

        setMetaData({
            type: selectedFile.type,
            name: selectedFile.name,
            size: useSizeConvert(selectedFile.size),
            lastModified: new Date(selectedFile.lastModified).toLocaleString(),
        })
    }

    const handleUpload = () => {
        startTransition(async () => {
            const formData: any = new FormData()

            try {
                formData.append('file', file)
                formData.append('ext', ext)
                formData.append('projectId', projectId)
                formData.append('name', metaData.name)
                formData.append('optimze', JSON.stringify(optimze))
                formData.append('isImage', JSON.stringify(isImage))
                formData.append('format', metaData.type)

                const response = await fetch('/api/bucket', {
                    method: 'POST',
                    body: formData,
                })
                const res = await response.json()

                if (!res.success) {
                    toast.error(`🥲 ${res.message}`)
                } else {
                    if (canRefrech) {
                        router.refresh()
                    }
                    toast.success(`✨🎉 ${res.message}`)
                    // setOpen(false)
                    setTraget(res.fileUrl)
                    setPreviewURL(res.fileUrl.URL)
                    setIsImage(res.fileUrl.type.startsWith("image/"))

                    setMetaData({
                        type: res.fileUrl.type,
                        name: res.fileUrl.name,
                        size: useSizeConvert(res.fileUrl.size),
                    })
                }
            } catch (error: any) {
                toast.error(`🥲 ${error.message}`)
            }
        })
    }

    const copyCode = async (e: any) => {
        try {
            await navigator.clipboard.writeText(e)
            toast.success("✨🎉File URL copied to your clipboard!")
            setOpen(false)
            setFile(null)
            setIsImage(false)
            setTraget(null)
            setMetaData(null)
            setPreviewURL(null)
            setOptimze(true)
            if (!canRefrech) {
                router.refresh()
            }
        } catch (error) {
            toast.error("🥲 Failed to copy text: " + error)
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={(e) => {
                setOpen(e)
                if (!e) {
                    setFile(null)
                    setIsImage(false)
                    setTraget(null)
                    setMetaData(null)
                    setPreviewURL(null)
                    setOptimze(true)
                    if (!canRefrech) {
                        router.refresh()
                    }
                }
                if (target_) {
                    setTraget(target_)
                    setPreviewURL(target_.URL)
                    setIsImage(target_.type.startsWith("image/"))

                    setMetaData({
                        type: target_.type,
                        name: target_.name,
                        size: useSizeConvert(target_.size),
                    })
                }

            }}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="max-h-[80svh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle className="flex ">
                            Upload file
                        </DialogTitle>
                        <DialogDescription className=" pt-4 w-full">
                            {previewURL && isImage ?
                                <>
                                    {target ?
                                        <img src={previewURL} className="!h-max my-auto max-h-60 object-cover w-full" />
                                        : <label htmlFor="dropzone-file" className=" relative w-full flex items-center justify-center rounded overflow-hidden">
                                            <img src={previewURL} className="!h-max my-auto max-h-60 object-cover w-full" />
                                            <div className="w-full h-full absolute hover:bg-muted/70 ease-in-out duration-200 bg-muted/20  flex items-end  justify-start p-3  hover:cursor-pointer text-foreground">
                                                Click to change
                                            </div>
                                        </label>}
                                </>
                                : !previewURL ? <label htmlFor="dropzone-file" className="flex flex-col ease-in-out duration-200 bg-muted/10 hover:bg-muted/20 items-center justify-center w-full h-40 border-2  border-dashed rounded-lg cursor-pointer ">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud size={30} />
                                        <p className="mb-2 text-sm">Click to upload </p>
                                    </div>
                                </label> : <div className='w-full rounded-md h-44 flex items-center justify-center bg-primary/20' >
                                    <File size={24} className='text-primary' />
                                </div>}
                            {!target && file && <label htmlFor="dropzone-file" className="mb-4 mt-2 w-full hover:cursor-pointer h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex gap-2 ease-in-out duration-200 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                                <UploadCloud size={18} />
                                Click to change
                            </label>}
                            {metaData && <>
                                {!target && <Input autoFocus placeholder="File name" className="my-2" value={metaData.name} onChange={(e) => setState(setMetaData, "name", e.target.value)} />}
                                <div className="p-4 border mt-2 rounded-md">
                                    <div className="w-full flex justify-center gap-2">
                                        <File size={16} />
                                        <div className="">
                                            <h1 className=" font-semibold text-foreground">
                                                {useHelfText(metaData.name, 30)}
                                            </h1>
                                            <p>
                                                {useHelfText(metaData.type, 25)}
                                            </p>
                                        </div>
                                        <div className="flex-1 justify-end flex">
                                            {metaData.size}
                                        </div>
                                    </div>
                                </div>
                            </>}
{/* 
                            {!target && file && isImage && <div className="p-4 border mt-2 rounded-md">
                                <div className="w-full flex justify-center gap-2">
                                    <DiameterIcon size={16} />
                                    <div className="">
                                        <h1 className="font-semibold text-foreground">Optimize</h1>
                                        <p>Reduce image size by converting to WebP</p>
                                    </div>
                                    <div className="flex-1 justify-end flex">
                                        <Switch checked={optimze} onCheckedChange={(e) => setOptimze(e)} />
                                    </div>
                                </div>
                            </div>} */}
                            <input onChange={handleFileChange} id="dropzone-file" type="file" className="hidden" />
                            {target && < >
                                <div className="p-4 border mt-2 w-full rounded-md">
                                    <div className="w-full flex justify-center gap-2">
                                        <Link2 size={16} />
                                        <div className="">
                                            <h1 className=" font-semibold text-foreground">
                                                Copy URL
                                            </h1>
                                            <p className="text-sm from-accent-foreground/60">
                                                {useHelfText(target.URL, 35)}
                                            </p>
                                        </div>
                                        <div className="flex-1 justify-end flex">
                                            <Button onClick={() => copyCode(target.URL)} variant={"outline"} size={"icon"}>
                                                <Copy size={15} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>}
                        </DialogDescription>
                        <DialogFooter>
                            {!target ? <LoadingButton className="w-full" onClick={handleUpload} isLoading={isPending}>
                                <Save size={20} />
                                Upload file
                            </LoadingButton> : <LoadingButton variant="destructive" className="w-full" onClick={async () => await useDelete({ id: target.id, projectId: projectId })} isLoading={isDelete}>
                                <Trash size={20} />
                                Delete file
                            </LoadingButton>}
                        </DialogFooter>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

