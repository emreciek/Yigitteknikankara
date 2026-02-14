'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DynamicPage() {
    const params = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        fetch('/api/pages')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const found = data.find(p => p.slug === params.slug);
                    if (found) {
                        setPage(found);
                    } else {
                        setNotFound(true);
                    }
                }
                setLoading(false);
            })
            .catch(() => {
                setNotFound(true);
                setLoading(false);
            });
    }, [params.slug]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="page-hero">
                    <h1>Yükleniyor...</h1>
                </div>
                <div className="loading"><div className="spinner"></div></div>
                <Footer />
            </>
        );
    }

    if (notFound) {
        return (
            <>
                <Navbar />
                <div className="page-hero">
                    <h1>Sayfa Bulunamadı</h1>
                    <p>Aradığınız sayfa mevcut değil.</p>
                </div>
                <div className="page-content" style={{ textAlign: 'center', padding: '80px 24px' }}>
                    <a href="/" className="btn btn-blue">Ana Sayfaya Dön</a>
                </div>
                <Footer />
            </>
        );
    }

    const serviceIcons = ['🔧', '⚙️', '🏗️', '🚨', '🔥', '💨'];

    return (
        <>
            <Navbar />
            <div className="page-hero">
                <h1>{page.title}</h1>
                {page.content && <p>{page.content}</p>}
            </div>

            {page.sections?.map((section, idx) => {
                if (section.type === 'services') {
                    let services = [];
                    try { services = JSON.parse(section.content); } catch { }
                    return (
                        <section className="section section-alt" key={section.id}>
                            <div className="container">
                                <div className="section-header">
                                    <h2>{section.title}</h2>
                                </div>
                                <div className="services-grid">
                                    {services.map((s, i) => (
                                        <div className="service-card" key={i}>
                                            <div className="service-icon">{serviceIcons[i] || '🔧'}</div>
                                            <h3>{s.title}</h3>
                                            <p>{s.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    );
                }

                if (section.type === 'gallery') {
                    return (
                        <section className="section" key={section.id}>
                            <div className="container">
                                <div className="section-header">
                                    <h2>{section.title}</h2>
                                    {section.content && <p>{section.content}</p>}
                                </div>
                                <div className="gallery-grid">
                                    {section.images?.map(img => (
                                        <div className="gallery-item" key={img.id}>
                                            <img
                                                src={img.filename.startsWith('http') ? img.filename : `/uploads/${img.filename}`}
                                                alt={img.alt || ''}
                                            />
                                            <div className="gallery-overlay">
                                                <span>{img.alt || ''}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    );
                }

                // Default: text section
                return (
                    <section className="section" key={section.id} style={idx % 2 === 1 ? { background: 'var(--gray-50)' } : {}}>
                        <div className="container">
                            <div className="section-header">
                                <h2>{section.title}</h2>
                            </div>
                            <div className="page-content">
                                <p>{section.content}</p>
                            </div>
                        </div>
                    </section>
                );
            })}

            <Footer />
        </>
    );
}
