import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { put, del } from '@vercel/blob';
import sharp from 'sharp';

export async function GET(request, { params }) {
    const id = parseInt(params.id);
    try {
        const service = await prisma.service.findUnique({ where: { id } });
        if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(service);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const id = parseInt(params.id);
    try {
        const formData = await request.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const active = formData.get('active') === 'true';
        const file = formData.get('image');

        const data = {
            title,
            description,
            active,
        };

        if (file && file.size > 0) {
            // Process with sharp → WebP, max 1920px wide
            const buffer = Buffer.from(await file.arrayBuffer());
            const processedBuffer = await sharp(buffer)
                .resize({ width: 1920, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();

            const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;

            // Upload to Vercel Blob
            const blob = await put(filename, processedBuffer, {
                access: 'public',
                contentType: 'image/webp',
            });
            data.imageUrl = blob.url;

            // Delete old Blob if it was a Blob CDN URL
            const existing = await prisma.service.findUnique({ where: { id } });
            if (existing?.imageUrl?.includes('blob.vercel-storage.com')) {
                try { await del(existing.imageUrl); } catch (_) { /* ignore */ }
            }
        }

        const updatedService = await prisma.service.update({
            where: { id },
            data,
        });

        return NextResponse.json(updatedService);
    } catch (error) {
        console.error('PUT /api/services/[id] error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const id = parseInt(params.id);
    try {
        const service = await prisma.service.findUnique({ where: { id } });

        // Delete from Vercel Blob if the URL points to Blob CDN
        if (service?.imageUrl?.includes('blob.vercel-storage.com')) {
            try { await del(service.imageUrl); } catch (_) { /* ignore */ }
        }

        await prisma.service.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
