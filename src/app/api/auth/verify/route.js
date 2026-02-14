import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
    try {
        const user = requireAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }
        return NextResponse.json({ valid: true, user });
    } catch (error) {
        console.error('Verify Auth Error:', error);
        return NextResponse.json({ error: 'Authentication Failed' }, { status: 500 });
    }
}
