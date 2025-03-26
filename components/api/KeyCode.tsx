"use client"

import { useHelfText } from "@/hooks/useState"
import { Copy } from "lucide-react"
import { toast } from "sonner"

export default function KeyCode({ code }: { code: string }) {
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code)
            toast.success("✨🎉API key copied to your clipboard!")
        } catch (error) {
            toast.error("🥲 Failed to copy text: " + error)
        }
    }

    return (
        <div className="text-foreground/60 text-sm border px-3 py-0.5 rounded-md bg-background w-max flex items-center justify-center gap-2">
            <span>
                {useHelfText(code, 3)}
                {useHelfText(code, 7, true).replace("...", "")}
            </span>
            <button onClick={copyToClipboard}>
                <Copy size={14} />
            </button>
        </div>
    )
}
