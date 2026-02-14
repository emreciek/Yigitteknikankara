'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Skip auth check for login page
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) {
            setChecking(false);
            setAuthenticated(true);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        fetch('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error('Invalid');
                return res.json();
            })
            .then(() => {
                setAuthenticated(true);
                setChecking(false);
            })
            .catch(() => {
                localStorage.removeItem('token');
                router.push('/admin/login');
            });
    }, [pathname, isLoginPage, router]);

    if (isLoginPage) return children;

    if (checking) {
        return (
            <div className="loading" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!authenticated) return null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        router.push('/admin/login');
    };

    const navItems = [
        { href: '/admin', label: '📊 Dashboard', icon: '📊' },
        { href: '/admin/images', label: '🖼️ Görseller', icon: '🖼️' },
        { href: '/admin/pages', label: '📄 Sayfalar', icon: '📄' },
        { href: '/admin/contact', label: '📞 İletişim', icon: '📞' },
    ];

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2><img src="/logo.png" alt="Logo" style={{ width: '28px', height: '28px', verticalAlign: 'middle', marginRight: '8px' }} />Yiğit Teknik</h2>
                    <p>Yönetim Paneli</p>
                </div>
                <ul className="admin-nav">
                    {navItems.map(item => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={pathname === item.href ? 'active' : ''}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    <li style={{ marginTop: '24px', borderTop: '1px solid var(--gray-800)', paddingTop: '16px' }}>
                        <a href="/" target="_blank" rel="noopener">🌐 Siteyi Görüntüle</a>
                    </li>
                    <li>
                        <a href="#" onClick={handleLogout} style={{ color: 'var(--danger)' }}>🚪 Çıkış Yap</a>
                    </li>
                </ul>
            </aside>
            <main className="admin-content">
                {children}
            </main>
        </div>
    );
}
