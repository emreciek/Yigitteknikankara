'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function EditServicePage({ params }) {
    // Unwrap params using React.use() as per Next.js 15+ guidance or simple async usage pattern if using older versions
    // For safety in client components where params is a promise in newer Next.js versions:
    const { id } = React.use(params);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [active, setActive] = useState(true);
    const [currentImage, setCurrentImage] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch(`/api/services/${id}`) // This endpoint needs to be implemented or we fetch all and find one? Better to have single fetch.
            // Actually, my plan didn't explicitly implement GET /api/services/[id], only PUT/DELETE.
            // I should assume I need to fetch it. I'll rely on fetching all for now or implement GET in [id]/route.js 
            // Wait, I implemented DELETE and PUT in [id]/route.js but not GET. 
            // I should probably fix that. For now I'll fetch list and find.
            // Or better, I'll update [id]/route.js to include GET.
            .then(res => {
                if (!res.ok) throw new Error('Failed');
                return res.json();
            })
            // Since I haven't implemented GET /api/services/[id] yet, this fetch might 404 or Method Not Allowed.
            // I will update the route in next step.
            .then(data => {
                setTitle(data.title);
                setDescription(data.description);
                setActive(data.active);
                setCurrentImage(data.imageUrl);
                setLoading(false);
            })
            .catch(err => {
                // If ID fetch fails, fallback to list (temporary hack until I fix route)
                fetch('/api/services').then(r => r.json()).then(list => {
                    const found = list.find(s => s.id === parseInt(id));
                    if (found) {
                        setTitle(found.title);
                        setDescription(found.description);
                        setActive(found.active);
                        setCurrentImage(found.imageUrl);
                    }
                    setLoading(false);
                }).catch(() => setLoading(false));
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('active', active);
        if (newImage) {
            formData.append('image', newImage);
        }

        try {
            const res = await fetch(`/api/services/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (res.ok) {
                router.push('/admin/services');
            } else {
                alert('Hata oluştu.');
            }
        } catch (error) {
            console.error(error);
            alert('Bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div className="admin-page">
            <header className="page-header">
                <h1>✏️ Hizmeti Düzenle</h1>
            </header>

            <div className="card">
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Hizmet Başlığı</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Açıklama</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                            />
                            Aktif Hizmet
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Görsel (Değiştirmek için yeni dosya seçin)</label>
                        {currentImage && (
                            <div style={{ marginBottom: '10px' }}>
                                <img src={`/uploads/${currentImage}`} alt="Mevcut" style={{ maxHeight: '100px', borderRadius: '4px' }} />
                                <p style={{ fontSize: '0.8rem', color: '#666' }}>Mevcut Görsel</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewImage(e.target.files[0])}
                            className="file-input"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
                    </button>
                </form>
            </div>
        </div>
    );
}
