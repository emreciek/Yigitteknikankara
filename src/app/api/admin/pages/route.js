import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
    try {
        const pages = await prisma.page.findMany({
            orderBy: { order: 'asc' },
            include: {
                sections: {
                    orderBy: { order: 'asc' },
                    include: { images: true },
                },
            },
        });
        return NextResponse.json(pages);
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
