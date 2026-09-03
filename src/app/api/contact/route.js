import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
    try {
        let contact = await prisma.contactInfo.findFirst();
        if (!contact) {
            contact = { address: '', phone: '', instagram: '', mapUrl: '', workingHours: '' };
        }
        return NextResponse.json(contact);
    } catch (error) {
        console.error('Contact GET error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function PUT(request) {
    const user = requireAuth(request);
    if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    try {
        const body = await request.json();

        // Sadece bilinen alanları al — ham data objesini Prisma'ya geçirmek
        // bilinmeyen/beklenmedik alan varsa Prisma hatası verebilir.
        const { address, phone, instagram, mapUrl, workingHours } = body;
        const safeData = { address, phone, instagram, mapUrl, workingHours };

        let contact = await prisma.contactInfo.findFirst();
        if (contact) {
            contact = await prisma.contactInfo.update({
                where: { id: contact.id },
                data: safeData,
            });
        } else {
            contact = await prisma.contactInfo.create({ data: safeData });
        }
        return NextResponse.json(contact);
    } catch (error) {
        console.error('Contact PUT error:', error);
        return NextResponse.json(
            { error: 'Güncelleme başarısız', detail: error.message },
            { status: 500 }
        );
    }
}
