import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: Request) {
    const restaurants = await prisma.user.findMany();
    return NextResponse.json(restaurants)
}

export async function POST(req: Request) {
    const json = await req.json()

    const created = await prisma.user.create({
        data: json
    });

    return new NextResponse(JSON.stringify(created), { status: 201 })
}