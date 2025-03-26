"use client"
import { GetProjectType, GetRoleType } from '@/hooks/useGet'
import React, { useState } from 'react'
import { Settings2, Trash2, User2, Wallet } from 'lucide-react'
import { setState } from '@/hooks/useState'
import { UserList } from './Action/UsersList'
import { Danger } from './Action/Danger'
import { GeneralInfo } from './Action/GeneralInfo'

export default function Settings({ project, membership }: { project: GetProjectType, membership: GetRoleType }) {

    const [states, setStates] = useState({
        activated: 0,
        variants: [
            { value: "General", icon: Settings2 },
            { value: "Billing", icon: Wallet },
            { value: "Users & permissions", icon: User2 },
            { value: "Danger", icon: Trash2 },
        ]
    })

    return (
        <div className='flex mt-5 min-h-[70svh] flex-col lg:flex-row'>
            <div className='w-max  pr-5 lg:flex lg:flex-col flex-row max-w-full overflow-auto mb-1 pb-1 gap-2'>
                {states.variants.map((state, index) => (
                    <div onClick={() => setState(setStates, "activated", index)} className={`${index === states.activated ? "bg-muted/20  !text-foreground/100" : "border-transparent"} border  ease-in-out duration-200 hover:bg-muted/20 hover:text-foreground/100 hover:cursor-pointer flex items-center justify-start gap-2 py-2 px-4 text-sm text-foreground/60 rounded-md`}>
                        <state.icon size={18} />
                        <h4>{state.value}</h4>
                    </div>
                ))}
            </div>
            <div className='flex-1 max-w-2xl mx-auto w-full overflow-auto'>
                {states.activated === 0 && <GeneralInfo project={project} role={membership?.role || ""} />}
                {states.activated === 1 && <Payments />}
                {states.activated === 2 && <UserList project={project} role={membership?.role || ""} />}
                {states.activated === 3 && <Danger project={project} role={membership?.role || ""} />}
            </div>
        </div>
    )
}



const Payments = () => {

    return (
        <div className='w-full space-y-1 mb-3 flex items-center justify-center h-60 bg-muted/20 border rounded-md'>
            <h3>Invalid for now</h3>
        </div>
    )
}
