'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [pages, setPages] = useState([]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetch('/api/pages')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPages(data.filter(p => p.slug !== 'home'));
                }
            })
            .catch(() => { });
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-inner">
                <Link href="/" className="navbar-logo">
                    <img src="/logo.png" alt="Yiğit Teknik Logo" className="logo-img" />
                    Yiğit Teknik
                </Link>

                <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <li><Link href="/" onClick={() => setMenuOpen(false)}>Ana Sayfa</Link></li>
                    {pages.map(page => (
                        <li key={page.id}>
                            <Link href={`/${page.slug}`} onClick={() => setMenuOpen(false)}>
                                {page.title}
                            </Link>
                        </li>
                    ))}
                    <li><Link href="/iletisim" onClick={() => setMenuOpen(false)}>İletişim</Link></li>
                    <li>
                        <Link href="tel:+902125550123" className="navbar-cta" onClick={() => setMenuOpen(false)}>
                            📞 Hemen Ara
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
