"use client"
import { cn } from '@/lib/utils'
import { Ban } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

const ImageWithLoader = ({ url, className }: any) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const handleLoad = () => {
        setLoading(false)
        setError(false)
    }

    const handleError = () => {
        setLoading(false)
        setError(true)
    }

    return (
        <div className='w-full'>
            {loading && <div className='overflow-hidden w-full rounded-md h-28 mb-3'>
                <div className='skeleton-box h-full w-full' />
            </div>}
            {error ? (
                <div className={cn('overflow-hidden text-destructive w-full rounded-md h-28 mb-3 bg-destructive/20 flex items-center justify-center gap-2')}>
                    <Ban size={20} className='text-destructive' />
                    Error loading image
                </div>
            ) : (
                <Image
                    alt='image'
                    width={400}
                    height={400}
                    src={url}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn('w-full rounded-md  object-cover', loading ? "h-0 " : " h-28 mb-3", className)}
                />
            )}
        </div>
    )
}

export default ImageWithLoader
