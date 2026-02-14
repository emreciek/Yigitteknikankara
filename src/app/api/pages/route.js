import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
    try {
        const pages = await prisma.page.findMany({
            where: { isVisible: true },
            orderBy: { order: 'asc' },
            include: { sections: { orderBy: { order: 'asc' }, include: { images: true } } },
        });
        return NextResponse.json(pages);
    } catch (error) {
        console.error('Pages GET error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function POST(request) {
    const user = requireAuth(request);
    if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    try {
        const { title, slug, content, isVisible, order } = await request.json();
        const page = await prisma.page.create({
            data: { title, slug, content, isVisible: isVisible ?? true, order: order ?? 0 },
        });
        return NextResponse.json(page, { status: 201 });
    } catch (error) {
        console.error('Pages POST error:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Bu slug zaten kullanılıyor' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
