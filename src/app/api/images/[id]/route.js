import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(request, { params }) {
    const user = requireAuth(request);
    if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    try {
        const { id } = await params;
        const image = await prisma.image.findUnique({ where: { id: parseInt(id) } });
        if (!image) return NextResponse.json({ error: 'Görsel bulunamadı' }, { status: 404 });

        // Delete file from disk
        try {
            const filepath = path.join(process.cwd(), 'public', 'uploads', image.filename);
            await unlink(filepath);
        } catch (err) {
            console.warn('Could not delete file:', err.message);
        }

        await prisma.image.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
