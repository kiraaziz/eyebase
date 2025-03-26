"use client"

import { setState } from "@/hooks/useState"
import { useEffect, useState, useTransition } from "react"
import { Input } from "../ui/input"
import { Database, Fingerprint, FlaskRound, Globe, Info, Key, Send, Trash } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import LoadingButton from "../global/LoadingButton"
import { FetchResponse } from "@/types/client"
import { toast } from "sonner"
import { JsonViewer } from "../collection/CreateDocument"
import { useRouter } from "next/navigation"
import MonacoEditor, { loader } from '@monaco-editor/react'
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
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

export default function TestForm({ collections }: any) {

    const methodMap: any = {
        "LIST": "GET",
        "READ SINGLE": "GET",
        "CREATE": "POST",
        "DELETE SINGLE": "DELETE",
        "UPDATE SINGLE": "PUT",
    }

    const [jsonText, setJsonText] = useState({})
    const [testForm, setTestForm] = useState({
        apiKey: "",
        methode: "",
        record: "",
        collectionName: ""
    })

    const [result, setResult] = useState(null)

    useEffect(() => {
        setResult(null)
    }, [testForm])

    useEffect(() => {
        if (testForm.methode == "LIST") {
            setJsonText({
                "where": [
                    {
                        "field": "name",
                        "operator": "equals",
                        "value": "kira"
                    }
                ],
                "pagination": {
                    "page": 1,
                    "perPage": 10
                },
                "select": [
                    "name",
                    "level"
                ]
            })
        } else {
            setJsonText({
                name: "kira"
            })
        }
    }, [testForm.methode])

    return (
        <div className="gap-3 pb-10">
            <form onSubmit={(e) => e.preventDefault()} className="min-h-[50svh] max-h-[65svh] col-span-2">
                <READ
                    method={methodMap[testForm.methode]}
                    form={testForm}
                    setTestForm={setTestForm}
                    result={result}
                    jsonText={jsonText}
                    setJsonText={setJsonText}
                    setResult={setResult} keyId={<>
                        <p className="flex items-center justify-center flex-row gap-1 w-max text-foreground/70 text-sm ">
                            <Key size={18} />
                            API key {testForm.methode}
                        </p>
                        <Input autoFocus placeholder="eye..." className="mb-3  bg-muted/40" value={testForm.apiKey} onChange={(e) => setState(setTestForm, "apiKey", e.target.value)} />
                    </>}
                    inputId={testForm.methode.includes("SINGLE") && <>
                        <p className="flex items-center justify-center flex-row gap-1 w-max text-foreground/70 text-sm ">
                            <Fingerprint size={18} />
                            Record ID
                        </p>
                        <Input className="mb-3  bg-muted/40" placeholder="id..." value={testForm.record} onChange={(e) => setState(setTestForm, "record", e.target.value)} /></>
                    }
                    collectionName={<>
                        <p className="flex items-center justify-center flex-row gap-1 w-max text-foreground/70 text-sm ">
                            <Database size={18} />
                            Collection name
                        </p>
                        <Select value={testForm.collectionName} onValueChange={(e) => setState(setTestForm, "collectionName", e)}>
                            <SelectTrigger className="w-full bg-muted/40">
                                <SelectValue placeholder="Select collection" />
                            </SelectTrigger>
                            <SelectContent>
                                {collections.map((collection: any) => (
                                    <SelectItem className="hover:bg-muted" value={collection.name}>
                                        {collection.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </>}

                    selector={<Select value={testForm.methode} onValueChange={(e) => {
                        setState(setTestForm, "methode", e)
                    }}>
                        <SelectTrigger className="w-full bg-muted/40">
                            <SelectValue placeholder="Select methode" />
                        </SelectTrigger>
                        <SelectContent>
                            {["LIST", "CREATE", "READ SINGLE", "UPDATE SINGLE", "DELETE SINGLE"].map((methode: any) => (
                                <SelectItem className="hover:bg-muted hover:cursor-pointer" value={methode}>
                                    {methode}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>}
                />
            </form>
        </div>
    )
}



const READ = ({ form, inputId, setResult, result, method, selector, collectionName, keyId, jsonText, setJsonText }: any) => {

    const router = useRouter()

    const [error, setError] = useState(false)
    const [isPending, startTransition] = useTransition()

    const fetchData = () => {
        startTransition(async () => {
            if (error) {
                toast.error(`🥲 Invalid JSON format`)
                return
            }

            if (!form.record && !["LIST", "CREATE"].includes(form.methode)) {
                setResult(null)
                toast.error(`🥲 Record ID is required`)
                return
            }

            const options: any = {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": form.apiKey
                },
                cache: "no-cache"
            }

            if (["UPDATE SINGLE", "CREATE"].includes(form.methode)) {
                options.body = JSON.stringify({ data: jsonText });
            }

            const req = await fetch(`/api/go/v0.1
                ${form.methode.includes("SINGLE") ? "/" + form.record : ""}
                ${(form.methode === "LIST")
                    ? `?collectionName=${form.collectionName}&query=${encodeURIComponent(JSON.stringify(jsonText))}`
                    : `?collectionName=${form.collectionName}`
                }`.replaceAll(" ", ""), options)

            try {
                const res: FetchResponse = await req.json()
                if (!res.status.success) {
                    setResult(null)
                    toast.error(`🥲 ${res.status.message}`)
                } else {
                    setResult(res)
                    toast.success(`✨🎉 ${res.status.message}`)
                    router.refresh()
                }
            } catch (e: any) {
                setResult(null)
                toast.error(`🥲 Fetch fail : ${e.message}`)
            }
        })
    }

    const handleEditorChange = (value: any) => {
        try {
            const parsedJson = JSON.parse(value)
            setJsonText(parsedJson)

            setError(false)
        } catch {
            // if (!error) {
            //     toast.error(`🥲 Invalid JSON format`)
            //     setError(true)
            // }
        }
    }

    return (
        <div className="w-full space-y-2 pb-5">
            <div className={`grid grid-cols-1 ${form.methode.includes("SINGLE") ? "lg:grid-cols-5" : "lg:grid-cols-3"} gap-2`}>
                <div className="space-y-1">
                    {keyId}
                </div>
                <div className="space-y-1">
                    {collectionName}
                </div>
                {form.methode.includes("SINGLE") && <div className="space-y-1">
                    {inputId}
                </div>}
                <div className={`w-full space-y-1  ${form.methode.includes("SINGLE") ? "lg:col-span-2" : "lg:col-span-1"}`}>
                    <p className="flex items-center justify-center flex-row gap-1 w-max text-foreground/70 text-sm ">
                        <Globe size={18} />
                        Methode
                    </p>
                    <div className={`w-full flex flex-col lg:flex-row gap-2`}>
                        {selector}
                        {result && <Button className="bg-muted/40 backdrop-blur" variant={"outline"} onClick={() => {
                            setResult(null)
                        }}>
                            <Trash size={18} />
                            Clear
                        </Button>}
                        <LoadingButton className={`${error && 'opacity-60'}`} disabled={!form.methode} type="submit" onClick={fetchData} isLoading={isPending}>
                            <Send size={20} />
                            Send request
                        </LoadingButton>
                    </div>
                </div>
            </div>
            <div className="w-full flex-row gap-2 flex p-5 rounded-md border bg-muted/20  backdrop-blur-xl">
                {
                    !result ?
                        <div className="w-full ">
                            {
                                ["UPDATE SINGLE", "CREATE", "LIST"].includes(form.methode) ? <div className="flex-1">
                                    <MonacoEditor
                                        height={400}
                                        defaultLanguage="json"
                                        theme="transparentTheme"
                                        value={JSON.stringify(jsonText, null, 2)}
                                        onChange={handleEditorChange}
                                        options={{
                                            minimap: { enabled: false },
                                            wordWrap: "on",
                                            automaticLayout: true,
                                        }}
                                    />
                                </div> : <div className={cn("w-full items-center justify-center flex flex-col gap-1 h-[40svh]")}>
                                    <div className="w-max flex items-center justify-center gap-2">
                                        <FlaskRound size={40} className="text-primary" />
                                        <h1 className="text-xl text-foreground">Experiment with Eyebase</h1>
                                    </div>
                                </div>
                            }
                        </div>
                        : <JsonViewer collapsed={false} json={result} />
                }
            </div>
        </div>
    )
}


