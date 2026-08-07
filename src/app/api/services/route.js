import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { put } from '@vercel/blob';
import path from 'path';
import sharp from 'sharp';

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(services);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const file = formData.get('image');

        let imageUrl = null;

        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const processedBuffer = await sharp(buffer)
                .resize({ width: 1920, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();
                
            const filename = Date.now() + '-' + Math.random().toString(36).substring(2, 8) + '.webp';
            const blob = await put(filename, processedBuffer, {
                access: 'public',
                contentType: 'image/webp',
            });
            imageUrl = blob.url;
        }

        const newService = await prisma.service.create({
            data: {
                title,
                description,
                imageUrl,
                active: true,
            },
        });

        return NextResponse.json(newService);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
