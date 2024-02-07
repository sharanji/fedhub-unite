import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextResponse) {

    const jsonReq = await req.json();
    const user = await prisma.user.findUnique({
        where: {
            email: jsonReq['email']
        }
    });

    if (user && user.otp == jsonReq['otp']) {
        await prisma.user.update({
            where: {
                email: user.email,
            },
            data: {
                otpVerified: true,
            },
        })
    }
    else {
        return NextResponse.json({
            "message": 'OTP Does\'t match',
            "data": user,
        }, { status: 401 });
    }

    return NextResponse.json({
        "message": 'OTP verified successfully',
        "data": user,
    }, { status: 200 });
}