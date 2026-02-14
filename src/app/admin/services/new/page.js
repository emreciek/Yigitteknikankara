'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewServicePage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        try {
            const res = await fetch('/api/services', {
                method: 'POST',
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
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <header className="page-header">
                <h1>➕ Yeni Hizmet Ekle</h1>
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
                            placeholder="Örn: Kombi Bakımı"
                        />
                    </div>

                    <div className="form-group">
                        <label>Açıklama</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                            placeholder="Hizmet hakkında kısa açıklama..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Görsel (Emoji yerine)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="file-input"
                        />
                        <p className="help-text">JPG, PNG veya SVG formatında yükleyin. Bu görsel, ana sayfadaki hizmetler bölümünde görünecektir.</p>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Kaydediliyor...' : '💾 Kaydet'}
                    </button>
                </form>
            </div>
        </div>
    );
}
