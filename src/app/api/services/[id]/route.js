import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

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
            active
        };

        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = Date.now() + '-' + file.name.replaceAll(' ', '_');

            await writeFile(
                path.join(process.cwd(), 'public/uploads/' + filename),
                buffer
            );
            data.imageUrl = filename;

            // Optionally delete old image here if needed
        }

        const updatedService = await prisma.service.update({
            where: { id },
            data,
        });

        return NextResponse.json(updatedService);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const id = parseInt(params.id);
    try {
        const service = await prisma.service.findUnique({ where: { id } });

        // Attempt to delete image file if it exists
        if (service?.imageUrl) {
            try {
                await unlink(path.join(process.cwd(), 'public/uploads/' + service.imageUrl));
            } catch (e) {
                // Ignore file delete error
            }
        }

        await prisma.service.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
