import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
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

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create uploads directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const ext = path.extname(file.name);
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);

        const image = await prisma.image.create({
            data: {
                filename,
                originalName: file.name,
                alt,
                category,
                sectionId: sectionId ? parseInt(sectionId) : null,
            },
        });

        return NextResponse.json(image, { status: 201 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Yükleme hatası' }, { status: 500 });
    }
}
