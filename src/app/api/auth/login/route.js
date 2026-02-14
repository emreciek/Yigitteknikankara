import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request) {
    try {
        console.log('Login request started');
        const body = await request.json();
        console.log('Request body received:', { username: body.username });

        const { username, password } = body;

        if (!username || !password) {
            console.log('Missing credentials');
            return NextResponse.json({ error: 'Kullanıcı adı ve şifre gerekli' }, { status: 400 });
        }

        console.log('Searching for admin user...');
        const admin = await prisma.admin.findUnique({ where: { username } });
        console.log('Admin search result:', admin ? 'Found' : 'Not Found');

        if (!admin) {
            return NextResponse.json({ error: 'Geçersiz kullanıcı adı veya şifre' }, { status: 401 });
        }

        console.log('Verifying password...');
        const valid = await bcrypt.compare(password, admin.password);
        console.log('Password valid:', valid);

        if (!valid) {
            return NextResponse.json({ error: 'Geçersiz kullanıcı adı veya şifre' }, { status: 401 });
        }

        console.log('Generating token...');
        const token = signToken({ id: admin.id, username: admin.username });
        console.log('Login successful');

        return NextResponse.json({ token, username: admin.username });
    } catch (error) {
        console.error('Login error detailed:', error);
        return NextResponse.json({ error: 'Sunucu hatası: ' + error.message }, { status: 500 });
    }
}
