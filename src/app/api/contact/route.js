import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
    try {
        let contact = await prisma.contactInfo.findFirst();
        if (!contact) {
            contact = { address: '', phone: '', email: '', mapUrl: '', workingHours: '' };
        }
        return NextResponse.json(contact);
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function PUT(request) {
    const user = requireAuth(request);
    if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    try {
        const data = await request.json();
        let contact = await prisma.contactInfo.findFirst();
        if (contact) {
            contact = await prisma.contactInfo.update({
                where: { id: contact.id },
                data,
            });
        } else {
            contact = await prisma.contactInfo.create({ data });
        }
        return NextResponse.json(contact);
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
