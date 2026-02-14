import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(request, { params }) {
    const user = requireAuth(request);
    if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    try {
        const { id } = await params;
        const data = await request.json();
        const section = await prisma.section.update({
            where: { id: parseInt(id) },
            data,
        });
        return NextResponse.json(section);
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const user = requireAuth(request);
    if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    try {
        const { id } = await params;
        await prisma.section.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
