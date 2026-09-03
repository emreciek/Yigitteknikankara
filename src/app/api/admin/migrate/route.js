import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * Tek seferlik veritabanı migration endpoint'i.
 * ContactInfo tablosuna email→instagram değişikliği sırasında eksik kalan
 * sütunları IF NOT EXISTS ile güvenli şekilde ekler.
 *
 * Kullanım: GET /api/admin/migrate  (Authorization: Bearer <token> header'ı ile)
 * Çalıştıktan sonra bu dosyayı silebilirsiniz.
 */
export async function GET(request) {
    const user = requireAuth(request);
    if (!user) {
        return NextResponse.json({ error: 'Yetkisiz — Authorization header gerekli' }, { status: 401 });
    }

    const results = [];

    try {
        // instagram sütununu ekle (email yerine)
        await prisma.$executeRawUnsafe(
            `ALTER TABLE "ContactInfo" ADD COLUMN IF NOT EXISTS "instagram" TEXT;`
        );
        results.push('✅ instagram sütunu eklendi (veya zaten vardı)');
    } catch (e) {
        results.push(`❌ instagram: ${e.message}`);
    }

    try {
        // mapUrl sütununu ekle
        await prisma.$executeRawUnsafe(
            `ALTER TABLE "ContactInfo" ADD COLUMN IF NOT EXISTS "mapUrl" TEXT;`
        );
        results.push('✅ mapUrl sütunu eklendi (veya zaten vardı)');
    } catch (e) {
        results.push(`❌ mapUrl: ${e.message}`);
    }

    try {
        // workingHours sütununu ekle
        await prisma.$executeRawUnsafe(
            `ALTER TABLE "ContactInfo" ADD COLUMN IF NOT EXISTS "workingHours" TEXT;`
        );
        results.push('✅ workingHours sütunu eklendi (veya zaten vardı)');
    } catch (e) {
        results.push(`❌ workingHours: ${e.message}`);
    }

    try {
        // Mevcut durumu doğrula
        const contact = await prisma.$queryRaw`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'ContactInfo'
            ORDER BY ordinal_position;
        `;
        results.push(`📋 Mevcut sütunlar: ${contact.map(r => r.column_name).join(', ')}`);
    } catch (e) {
        results.push(`⚠️ Sütun listesi alınamadı: ${e.message}`);
    }

    return NextResponse.json({ migration: 'tamamlandı', results });
}
