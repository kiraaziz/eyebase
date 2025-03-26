"use client"
import LoadingButton from '@/components/global/LoadingButton'
import { setState } from '@/hooks/useState'
import { signIn } from 'next-auth/react'
import React, { useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Countdown from 'react-countdown'
import { FollowEye } from '@/components/global/Logo'
import { Loader, RefreshCcw } from 'lucide-react'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from 'sonner'
import { useFetch } from '@/hooks/useFecth'

export default function page() {


    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, starTransition] = useTransition()

    const [savedTime, setSavedTime] = useState<any>(null)
    const loadCurrentTime = () => {
        const savedTime = localStorage.getItem('currentTime')
        return savedTime ? new Date(savedTime) : null
    }


    useEffect(() => {
        const time = loadCurrentTime()
        setSavedTime(time)
    }, [])

    const [user, setUser] = useState({
        email: searchParams.get("email"),
        otp: ""
    })

    const [focus, setForcus] = useState(true)


    const handleLogin = (value: any) => {
        starTransition(async () => {
            setForcus(false)

            const userRes = await signIn("credentials", {
                email: user.email,
                otp: value,
            })

            if (userRes?.error) {
                toast.error(`🥲 ${userRes.error}`)
                setState(setUser, "otp", "")
                setForcus(true)
            } else {
                localStorage.setItem('currentTime', "")
                router.refresh()
                router.push("/app")
            }
        })

    }

    const [isVerify, useVerify] = useFetch("/auth/user", "PUT", (res) => {
        if (res.success) {
            const currentTime = new Date().toISOString()
            localStorage.setItem('currentTime', currentTime)

            const time = loadCurrentTime()
            setSavedTime(time)
        }
    })

    return (
        <div className=' max-w-5xl p-4 mx-auto  flex items-center flex-col lg:pt-[20svh] text-center'>
            <FollowEye />
            <h1 className='mt-5 text-2xl font-bold flex items-center justify-center gap-2'>
                {isPending && <Loader size={17} className='animate-spin' />}
                Verify your email
            </h1>
            <p className='text-sm  text-foreground/60 mb-3'>We've sent a 6-digit code to your email address. <br />Please enter it below.</p>
            <InputOTP value={user.otp}
                onChange={async (value) => {
                    setState(setUser, "otp", value)
                    if (value.length === 6) {
                        handleLogin(value)
                    }
                }}
                autoFocus={focus} maxLength={6}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
            <div className='w-full max-w-xs mt-7'>
                <LoadingButton isLoading={isVerify} onClick={async () => await useVerify(user)} className='w-full'>
                    <RefreshCcw size={17} />
                    Resend verification code
                </LoadingButton>
                {savedTime && <div className='w-full flex items-center justify-start mt-0.5 gap-1 text-sm text-foreground/70'>
                    <Countdown renderer={({ minutes, seconds, completed }) => {
                        if (completed) {
                            return <p>The code has expired. Please click the button below to resend it.</p>
                        } else {
                            return <>
                                <p>Code expired after </p>
                                <span>{minutes}:{seconds}</span>
                            </>
                        }
                    }} date={new Date(savedTime.getTime() + 5 * 60 * 1000)} />
                </div>}

            </div>
        </div>
    )
}
