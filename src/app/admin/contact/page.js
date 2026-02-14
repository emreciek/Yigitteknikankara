'use client';

import { useState, useEffect } from 'react';

export default function AdminContact() {
    const [form, setForm] = useState({
        address: '',
        phone: '',
        email: '',
        mapUrl: '',
        workingHours: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    const showToast = (msg, type = 'success') => {
        setToast({ message: msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetch('/api/contact')
            .then(r => r.json())
            .then(data => {
                setForm({
                    address: data.address || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    mapUrl: data.mapUrl || '',
                    workingHours: data.workingHours || '',
                });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch('/api/contact', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                showToast('İletişim bilgileri güncellendi');
            } else {
                showToast('Güncelleme hatası', 'error');
            }
        } catch {
            showToast('Bağlantı hatası', 'error');
        }

        setSaving(false);
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <>
            <div className="admin-header">
                <h1>İletişim Bilgileri</h1>
            </div>

            <div className="admin-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>📍 Adres</label>
                        <textarea
                            value={form.address}
                            onChange={e => setForm({ ...form, address: e.target.value })}
                            placeholder="Şirket adresi..."
                            rows={3}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label>📞 Telefon</label>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                placeholder="+90 (212) 555 0123"
                            />
                        </div>
                        <div className="form-group">
                            <label>📧 E-posta</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="info@yigitteknik.com"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>🕐 Çalışma Saatleri</label>
                        <input
                            type="text"
                            value={form.workingHours}
                            onChange={e => setForm({ ...form, workingHours: e.target.value })}
                            placeholder="Pazartesi - Cumartesi: 08:00 - 18:00"
                        />
                    </div>

                    <div className="form-group">
                        <label>🗺️ Google Maps Embed URL</label>
                        <input
                            type="url"
                            value={form.mapUrl}
                            onChange={e => setForm({ ...form, mapUrl: e.target.value })}
                            placeholder="https://www.google.com/maps/embed?pb=..."
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '6px' }}>
                            Google Maps &gt; Paylaş &gt; Haritayı yerleştir &gt; src URL&apos;sini kopyalayın
                        </p>
                    </div>

                    <button type="submit" className="btn btn-blue" disabled={saving}>
                        {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
                    </button>
                </form>
            </div>

            {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
        </>
    );
}
