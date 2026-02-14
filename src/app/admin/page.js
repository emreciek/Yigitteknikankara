'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ pages: 0, images: 0, sections: 0 });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        Promise.all([
            fetch('/api/admin/pages', { headers }).then(r => r.json()),
            fetch('/api/images', { headers }).then(r => r.json()),
        ])
            .then(([pages, images]) => {
                const pagesArr = Array.isArray(pages) ? pages : [];
                const imagesArr = Array.isArray(images) ? images : [];
                const sectionsCount = pagesArr.reduce((acc, p) => acc + (p.sections?.length || 0), 0);
                setStats({
                    pages: pagesArr.length,
                    images: imagesArr.length,
                    sections: sectionsCount,
                });
            })
            .catch(() => { });
    }, []);

    return (
        <>
            <div className="admin-header">
                <h1>Dashboard</h1>
            </div>

            <div className="admin-cards">
                <div className="admin-card">
                    <div className="card-icon">📄</div>
                    <div className="card-number">{stats.pages}</div>
                    <div className="card-label">Toplam Sayfa</div>
                </div>
                <div className="admin-card">
                    <div className="card-icon">🖼️</div>
                    <div className="card-number">{stats.images}</div>
                    <div className="card-label">Toplam Görsel</div>
                </div>
                <div className="admin-card">
                    <div className="card-icon">📑</div>
                    <div className="card-number">{stats.sections}</div>
                    <div className="card-label">Toplam Bölüm</div>
                </div>
                <div className="admin-card">
                    <div className="card-icon">✅</div>
                    <div className="card-number">Aktif</div>
                    <div className="card-label">Sistem Durumu</div>
                </div>
            </div>

            <div className="admin-table-card">
                <div className="admin-table-header">
                    <h2>Hızlı İşlemler</h2>
                </div>
                <div style={{ padding: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <a href="/admin/images" className="btn btn-blue btn-sm">🖼️ Görsel Yükle</a>
                    <a href="/admin/pages" className="btn btn-outline btn-sm">📄 Sayfa Ekle</a>
                    <a href="/admin/contact" className="btn btn-outline btn-sm">📞 İletişim Düzenle</a>
                    <a href="/" target="_blank" rel="noopener" className="btn btn-outline btn-sm">🌐 Siteyi Gör</a>
                </div>
            </div>
        </>
    );
}
