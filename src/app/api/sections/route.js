import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const pageId = searchParams.get('pageId');
        const where = pageId ? { pageId: parseInt(pageId) } : {};
        const sections = await prisma.section.findMany({
            where,
            orderBy: { order: 'asc' },
            include: { images: true },
        });
        return NextResponse.json(sections);
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function POST(request) {
    const user = requireAuth(request);
    if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    try {
        const { pageId, title, content, type, order } = await request.json();
        const section = await prisma.section.create({
            data: { pageId, title, content, type: type || 'text', order: order || 0 },
        });
        return NextResponse.json(section, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
