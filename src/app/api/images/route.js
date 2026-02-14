import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const where = category ? { category } : {};
        const images = await prisma.image.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(images);
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
