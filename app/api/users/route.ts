import { prisma } from '@/lib/prisma'
import { NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server'
import { render } from "@react-email/render"
import WelcomeTemplate from "@/app/emails/WelcomeTemplate"

export async function GET(req: Request) {
    const users = await prisma.user.findMany();
    return NextResponse.json(users)
}

export async function POST(req: Request) {
    const json = await req.json()
    var created;
    try {
        created = await prisma.user.create({
            data: json
        });

    } catch (error) {
        return new NextResponse(JSON.stringify({ 'message': error }), { status: 500 })
    }

    const otpGenerator = require('otp-generator');
    const Otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    let nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
            user: process.env.SMTP_USER || "user",
            pass: process.env.SMTP_PASSWORD || "pass",
        },
        secure: true,
    });



    const mailData = {
        from: process.env.SMTP_USER,
        to: created.email,
        subject: `Otp Verification Message From fedhub`,
        text: 'Message from Fedhub for otp verification',
        html: WelcomeTemplate({ fullName: created.fullName, "OTP": Otp }),
    }

    transporter.sendMail(mailData, function (err: any, info: any) {
        if (err) console.log(err)
    });

    await prisma.user.update({
        where: {
            email: created.email,
        },
        data: {
            otp: Otp,
        },
    })

    return new NextResponse(JSON.stringify({ 'message': "user created succssfully", "otp": "sent to mail", "data": created }), { status: 201 })
}

