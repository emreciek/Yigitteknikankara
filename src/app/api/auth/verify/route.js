import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
    const user = requireAuth(request);
    if (!user) {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    return NextResponse.json({ valid: true, user });
}
