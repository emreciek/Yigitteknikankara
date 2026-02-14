'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
    const [contact, setContact] = useState(null);

    useEffect(() => {
        fetch('/api/contact')
            .then(res => res.json())
            .then(data => setContact(data))
            .catch(() => { });
    }, []);

    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3><img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', verticalAlign: 'middle', marginRight: '8px' }} />Yiğit Teknik</h3>
                        <p>
                            Profesyonel kombi ve ısıtma sistemleri teknik servisi.
                            Uzman ekibimizle kaliteli ve güvenilir hizmet sunuyoruz.
                        </p>
                    </div>

                    <div>
                        <h4>Hızlı Linkler</h4>
                        <ul>
                            <li><Link href="/">Ana Sayfa</Link></li>
                            <li><Link href="/hakkimizda">Hakkımızda</Link></li>
                            <li><Link href="/iletisim">İletişim</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Hizmetler</h4>
                        <ul>
                            <li><a href="#">Kombi Bakımı</a></li>
                            <li><a href="#">Kombi Tamiri</a></li>
                            <li><a href="#">Kombi Montajı</a></li>
                            <li><a href="#">Acil Servis</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4>İletişim</h4>
                        <ul>
                            {contact?.phone && <li>📞 {contact.phone}</li>}
                            {contact?.instagram && (
                                <li>
                                    <a href={contact.instagram.startsWith('http') ? contact.instagram : `https://instagram.com/${contact.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                                        📸 {contact.instagram}
                                    </a>
                                </li>
                            )}
                            {contact?.address && <li>📍 {contact.address}</li>}
                            {contact?.workingHours && <li>🕐 {contact.workingHours}</li>}
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Yiğit Teknik. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </footer>
    );
}
