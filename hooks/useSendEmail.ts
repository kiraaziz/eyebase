"use server"
import nodemailer from 'nodemailer'

export const useSendEmail = async (to: string, subject: string, content: string) => {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        text: content,
    };

    const mail = await transporter.sendMail(mailOptions)
    return mail
}

