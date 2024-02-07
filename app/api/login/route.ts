import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: Request) {
    const json = await req.json()

    const user = await prisma.user.findUnique({
        where: {
            email: json['email']
        }
    })

    if (!user || user.password != json['password']) {
        return new NextResponse(JSON.stringify({
            message: "Invalid Credentails",
        }), { status: 401 })
    }


    return new NextResponse(JSON.stringify({
        message: "Login Successfull",
        userData: user,
    }), { status: 200 })
}