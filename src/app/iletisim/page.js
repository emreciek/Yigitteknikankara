'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
    const [contact, setContact] = useState(null);

    useEffect(() => {
        fetch('/api/contact')
            .then(res => res.json())
            .then(data => setContact(data))
            .catch(() => { });
    }, []);

    return (
        <>
            <Navbar />

            <div className="page-hero">
                <h1>İletişim</h1>
                <p>Sorularınız ve randevu talepleriniz için bize ulaşabilirsiniz.</p>
            </div>

            <section className="section">
                <div className="container">
                    <div className="contact-grid">
                        <div className="contact-info-cards">
                            <div className="contact-card">
                                <div className="contact-icon">📍</div>
                                <div>
                                    <h3>Adresimiz</h3>
                                    <p>{contact?.address || 'Yükleniyor...'}</p>
                                </div>
                            </div>
                            <div className="contact-card">
                                <div className="contact-icon">📞</div>
                                <div>
                                    <h3>Telefon</h3>
                                    <p>
                                        <a href={`tel:${contact?.phone}`} style={{ color: 'var(--blue-600)', fontWeight: 600 }}>
                                            {contact?.phone || 'Yükleniyor...'}
                                        </a>
                                    </p>
                                </div>
                            </div>
                            {contact?.instagram && (
                                <div className="contact-card">
                                    <div className="contact-icon">📸</div>
                                    <div>
                                        <h3>Instagram</h3>
                                        <p>
                                            <a href={contact.instagram.startsWith('http') ? contact.instagram : `https://instagram.com/${contact.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue-600)', fontWeight: 600 }}>
                                                {contact.instagram}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            )}
                            {contact?.workingHours && (
                                <div className="contact-card">
                                    <div className="contact-icon">🕐</div>
                                    <div>
                                        <h3>Çalışma Saatleri</h3>
                                        <p>{contact.workingHours}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="contact-map">
                            {contact?.mapUrl ? (
                                <iframe src={contact.mapUrl} title="Harita" allowFullScreen loading="lazy" />
                            ) : (
                                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🗺️</div>
                                    <p>Harita bağlantısı admin panelinden eklenebilir.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section section-blue">
                <div className="container cta-section">
                    <h2>Acil Servis Hizmeti</h2>
                    <p>7/24 kombiniz için yanınızdayız. Hemen arayın!</p>
                    <div className="cta-buttons">
                        <a href={`tel:${contact?.phone || '+902125550123'}`} className="btn btn-primary">
                            📞 Hemen Ara
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
