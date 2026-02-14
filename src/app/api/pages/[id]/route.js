import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const page = await prisma.page.findUnique({
            where: { id: parseInt(id) },
            include: { sections: { orderBy: { order: 'asc' }, include: { images: true } } },
        });
        if (!page) return NextResponse.json({ error: 'Sayfa bulunamadı' }, { status: 404 });
        return NextResponse.json(page);
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const user = requireAuth(request);
    if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    try {
        const { id } = await params;
        const data = await request.json();
        const page = await prisma.page.update({
            where: { id: parseInt(id) },
            data,
        });
        return NextResponse.json(page);
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const user = requireAuth(request);
    if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    try {
        const { id } = await params;
        await prisma.page.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
