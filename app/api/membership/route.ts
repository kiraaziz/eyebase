import { prisma } from "@/hooks/usePrisma"
import { getServerSession } from "next-auth"
import { options } from "../auth/[...nextauth]/Options"
import { useHavePermission } from "@/hooks/usePermission"
import { NextResponse } from "next/server"
import { useSendEmail } from "@/hooks/useSendEmail"

export const POST = async (req: Request) => {

    const { projectId, email, role } = await req.json()

    const havePermission = await useHavePermission(projectId, ["admin"])
    if (havePermission !== true) return NextResponse.json(havePermission)

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({
        success: false,
        message: "invalid email",
    })

    if (role === "viewer" || role === "editor") {

        const memberExist = await prisma.membership.findFirst({
            where: {
                projectId: projectId,
                OR: [
                    { tempMail: email.toLowerCase() },
                    {
                        user: {
                            email: email.toLowerCase()
                        }
                    }
                ]
            }
        })

        if (memberExist) {
            return NextResponse.json({
                success: false,
                message: "User already exist",
            })
        }

        const member = await prisma.membership.create({
            data: {
                projectId: projectId,
                blocked: false,
                tempMail: email.toLowerCase(),
                role: role
            },
            include: {
                project: true
            }
        })

        await useSendEmail(email, `Join ${member.project.name} team - eyebase`, getMail(`${process.env.ROOT_URL}/app/join/${member.projectId}`, member.project.name || ""))

        return NextResponse.json({
            success: true,
            message: "User invited successfully",
        })
    }

    return NextResponse.json({
        success: false,
        message: "invalid role",
    })
}

export const PUT = async (req: Request) => {

    const { user: { id } }: any = await getServerSession(options)
    const { projectId, memberId, action } = await req.json()

    const havePermission = await useHavePermission(projectId, ["admin"])
    if (havePermission !== true) return NextResponse.json(havePermission)

    if (action === "admin") {

        await prisma.membership.update({
            data: {
                role: "admin"
            },
            where: {
                id: memberId
            }
        })

        await prisma.membership.updateMany({
            data: {
                role: "editor"
            },
            where: {
                userId: id
            }
        })


        return NextResponse.json({
            success: true,
            message: "Update user to admin successfully",
        })
    } else if (action === "delete") {

        await prisma.membership.delete({
            where: {
                id: memberId
            }
        })

        return NextResponse.json({
            success: true,
            message: "Delete user successfully",
        })
    } else if (action === "viewer" || action === "editor") {

        await prisma.membership.update({
            data: {
                role: action
            },
            where: {
                id: memberId
            }
        })

        return NextResponse.json({
            success: true,
            message: "Update user to " + action + " successfully",
        })
    }

    return NextResponse.json({
        success: false,
        message: "invalid action",
    })
}

const getMail = (link: string, name: string) => {

    return (
        ` <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
    <tbody>
      <tr>
        <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
          <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
            <tbody>
              <tr>
                <td style="padding: 40px 0px 0px;">
                  <div style="text-align: left;">
                    <div style="padding-bottom: 20px;"><img src="${process.env.ROOT_URL}/eyebase-bg.png" alt="Company" style="width: 56px;"></div>
                  </div>
                  <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                    <div style="color: rgb(0, 0, 0); text-align: left;">
                      <h1 style="margin: 1rem 0">✨ Join ${name} team </h1>
                      <p style="padding-bottom: 16px">click on this link to join the team</p>
                      <p style="padding-bottom: 16px"><a href=${link} target="_blank" style="padding: 12px 24px; border-radius: 4px; color: #000000; background: #FFF444;display: inline-block;margin: 0.5rem 0;"> Join ${name}</a></p>
                      <p style="padding-bottom: 16px">If you didn’t ask to join a team with this address, you can ignore this email.</p>
                      <p style="padding-bottom: 16px">Thanks,<br>Eyebase team - kira</p>
                    </div>
                  </div>
                  <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                    <p style="padding-bottom: 16px">Made with ♥ in Tunisia</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>`
    )
}