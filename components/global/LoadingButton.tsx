"use client"
import { Loader2 } from "lucide-react"
import { Button } from "../ui/button"
// import { ScatterBoxLoader } from "react-awesome-loaders"

export default function LoadingButton({ isLoading, variant, children, ...props }: { variant?: "default" | "more" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined, isLoading: boolean; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <Button variant={variant} size={!isLoading ? "default" : "icon"} disabled={isLoading} {...props}>
                {isLoading ?
                // <ScatterBoxLoader
                //     primaryColor={"#6366F1"}
                //     background={"transparent"}
                // />
                <Loader2 className="animate-spin " size={15} />
                : children
            }
        </Button>
    )
}
