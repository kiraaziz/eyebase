import { NextRequest, NextResponse } from 'next/server'
// import sharp from 'sharp'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/lib/firebase/connection'
import { useHavePermission } from '@/hooks/usePermission'
import { prisma } from '@/hooks/usePrisma'

export async function POST(req: NextRequest) {


    const formData: any = await req.formData()
    const file: any = formData.get('file')
    const projectId: any = formData.get('projectId')

    const havePermission = await useHavePermission(projectId, ["admin", "editor"])
    if (havePermission !== true) return NextResponse.json(havePermission)

    const name: any = formData.get('name')
    const optimize: any = JSON.parse(formData.get('optimze') || false)
    const isImage: any = JSON.parse(formData.get('isImage') || false)
    const format: any = formData.get('format')
    const ext: any = formData.get('ext')

    if (!name) {
        return NextResponse.json({
            success: false,
            message: "Name is required",
        })
    }

    if (!file || !(file instanceof Blob)) {
        return NextResponse.json({
            success: false,
            message: "Invalid file",
        })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    let processedBuffer = fileBuffer

    let fileName = `image_${Date.now()}.` + ext

    // if (isImage && optimize) {
    //     const sharpImage = sharp(fileBuffer).unflatten()
    //     sharpImage.toFormat("webp", { quality: Math.round(0.5 * 100) })
    //     processedBuffer = await sharpImage.toBuffer()
    //     fileName = `image_${Date.now()}.` + "webp"
    // }

    const fileRef = ref(storage as any, `upload/${fileName}`)

    await uploadBytes(fileRef, processedBuffer as any)
    const downloadURL = await getDownloadURL(fileRef)


    const fileUrl = await prisma.file.create({
        data: {
            size: processedBuffer.length,
            firebaseRef: `upload/${fileName}`,
            type: format,
            name: name,
            URL: downloadURL,
            projectId: projectId
        }
    })
    return NextResponse.json({
        success: true,
        message: "File uploaded",
        fileUrl
    })
}


export const DELETE = async (req: Request) => {


    const { projectId, id } = await req.json()
    const havePermission = await useHavePermission(projectId, ["admin", "editor"])
    if (havePermission !== true) return NextResponse.json(havePermission)

    const file_: any = await prisma.file.findUnique({
        where: {
            id: id,
            projectId: projectId
        },
        select: {
            firebaseRef: true
        }
    })

    const fileRef = ref(storage as any, `${file_.firebaseRef}`)

    await deleteObject(fileRef)

    const file = await prisma.file.delete({
        where: {
            id: id,
            projectId: projectId
        }
    })

    return NextResponse.json({
        success: true,
        message: "File deleted successfully",
        file
    })
}
