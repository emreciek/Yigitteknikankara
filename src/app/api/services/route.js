import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

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
            const filename = Date.now() + '-' + file.name.replaceAll(' ', '_');

            await writeFile(
                path.join(process.cwd(), 'public/uploads/' + filename),
                buffer
            );
            imageUrl = filename;
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
