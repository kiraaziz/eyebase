"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"
import { Input } from "../ui/input"
import { useState } from "react"
import { setState } from "@/hooks/useState"
import { useFetch } from "@/hooks/useFecth"
import { useRouter } from "next/navigation"
import LoadingButton from "../global/LoadingButton"
import { Button } from "../ui/button"
import Link from "next/link"

export default function CreateProject({ children }: any) {

    const [path, setPath] = useState("")
    const [teamProject, setTeamProject] = useState({
        name: "",
        image: ""
    })

    const [isCreating, useCreate] = useFetch("/project", "POST", async (res) => {
        // setPath(`/${res.project.id}`)
    })

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex ">
                        Create Your project</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <p className="text-sm text-foreground/60 font-light">
                        Keep you data simple, clean and Secure
                    </p>
                    {!path ? <div className="w-full flex flex-row mt-3">
                        <form onSubmit={(e) => e.preventDefault()} className="flex-1 ml-2 space-y-2 ">
                            <Input value={teamProject.name} onChange={(e) => setState(setTeamProject, "name", e.target.value)} placeholder="Cool database name..." />
                            <LoadingButton isLoading={isCreating} type="submit" onClick={() => useCreate(teamProject)} className="w-full">
                                <Save size={20} />
                                Save
                            </LoadingButton>
                        </form>
                    </div> :
                        <div className="w-full flex flex-row mt-3">
                            <Link href={path} className="w-full">
                                <Button className="w-full">
                                    Go to <h1 className="bg-muted/20 px-2 rounded-full border">{teamProject.name}</h1>
                                    <ChevronRight size={20} />
                                </Button>
                            </Link>
                        </div>
                    }
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
