import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Kullanıcı adı ve şifre gerekli' }, { status: 400 });
        }

        const admin = await prisma.admin.findUnique({ where: { username } });
        if (!admin) {
            return NextResponse.json({ error: 'Geçersiz kullanıcı adı veya şifre' }, { status: 401 });
        }

        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) {
            return NextResponse.json({ error: 'Geçersiz kullanıcı adı veya şifre' }, { status: 401 });
        }

        const token = signToken({ id: admin.id, username: admin.username });

        return NextResponse.json({ token, username: admin.username });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
