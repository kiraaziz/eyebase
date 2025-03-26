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
import MonacoEditor, { loader } from '@monaco-editor/react'
import { setState } from "@/hooks/useState"
import LoadingButton from "../global/LoadingButton"
import { AlertTriangle, Save, Trash2 } from "lucide-react"
import { useFetch } from "@/hooks/useFecth"
import ReactJson from 'react-json-view'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

loader.init().then((monaco) => {
    monaco.editor.defineTheme('transparentTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#00000000',
        },
    })
})


export default function CreateDocument({ projectId, colId, target, children }: any) {

    const [open, setOpen] = useState(false)
    const [error, setError] = useState(false)
    const [openDel, setOpenDel] = useState(false)

    const [isCreate, useCreate] = useFetch("/document", "POST", () => { setOpen(false) })
    const [isUpdate, useUpdate] = useFetch("/document", "PUT", () => { })
    const [isDelete, useDelete] = useFetch("/document", "DELETE", () => {
        setOpen(false)
        setOpenDel(false)
    })

    const [doc, setDoc] = useState({
        projectId: projectId,
        colId: colId,
        json: {
            data: ""
        }
    })

    const handleEditorChange = (value: any) => {
        try {
            const parsedJson = JSON.parse(value)
            setState(setDoc, "json", parsedJson)

            setError(false)
        } catch {
            if (!error) {
                // toast.error("Invalid json format")
                setError(true)
            }
        }
    }

    return (
        <>
            <AlertDialog open={openDel} onOpenChange={(e) => setOpenDel(e)} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Document</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this document? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <LoadingButton variant="destructive" isLoading={isDelete} onClick={() => useDelete({ id: target.id, ...doc })}>
                            <Trash2 size={20} />
                            Delete
                        </LoadingButton>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={open} onOpenChange={(e) => {
                setOpen(e)
                setDoc({
                    projectId: projectId,
                    colId: colId,
                    json: target ? JSON.parse(target.content) : { data: "" }
                })
            }}>
                <DialogTrigger>
                    {children}
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex ">
                            Edit your JSON
                        </DialogTitle>
                        <DialogDescription className=" py-4">
                            <MonacoEditor
                                onMount={(editor) => {
                                    editor.focus()
                                }}
                                height={400}
                                defaultLanguage="json"
                                theme="transparentTheme"
                                value={JSON.stringify(doc.json, null, 2)}
                                onChange={handleEditorChange}
                                options={{
                                    minimap: { enabled: false },
                                    wordWrap: "on",
                                    automaticLayout: true,
                                }}
                            />
                        </DialogDescription>
                        <DialogFooter>
                            {error && <p className="flex items-center justify-center gap-1 w-max text-sm font-light text-destructive">
                                <AlertTriangle size={15} />
                                Invalid json formats
                            </p>}
                            {target ?
                                <div className='flex items-center justify-center gap-1 flex-row-reverse w-max'>
                                    <LoadingButton disabled={error} type="submit" isLoading={isUpdate} onClick={() => useUpdate({ id: target.id, ...doc })}>
                                        <Save size={20} />
                                        Update
                                    </LoadingButton>
                                    <LoadingButton variant="destructive" isLoading={false} onClick={() => setOpenDel(true)}>
                                        <Trash2 size={20} />
                                        Delete
                                    </LoadingButton>
                                </div>
                                : <LoadingButton disabled={error} type="submit" isLoading={isCreate} onClick={() => useCreate(doc)}>
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

export function JsonViewer({ json, collapsed = true }: any) {

    return (
        <div className="mt-2 w-full">
            <ReactJson
                src={json}
                style={{ background: "transparent" }}
                collapsed={collapsed}
                theme={"google"}
            />
        </div>
    )
}