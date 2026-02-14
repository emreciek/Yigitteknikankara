import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { put } from '@vercel/blob';
import path from 'path';

export async function POST(request) {
    const user = requireAuth(request);
    if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const category = formData.get('category') || 'gallery';
        const alt = formData.get('alt') || '';
        const sectionId = formData.get('sectionId');

        if (!file) {
            return NextResponse.json({ error: 'Dosya gerekli' }, { status: 400 });
        }

        // Generate unique filename
        const ext = path.extname(file.name);
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

        // Upload to Vercel Blob
        const blob = await put(filename, file, {
            access: 'public',
        });

        // Parse sectionId safely
        let parsedSectionId = null;
        if (sectionId && sectionId !== 'null' && sectionId !== 'undefined') {
            const parsed = parseInt(sectionId);
            if (!isNaN(parsed)) {
                parsedSectionId = parsed;
            }
        }

        const image = await prisma.image.create({
            data: {
                filename: blob.url,
                originalName: file.name,
                alt,
                category,
                sectionId: parsedSectionId,
            },
        });

        return NextResponse.json(image, { status: 201 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Yükleme hatası' }, { status: 500 });
    }
}
