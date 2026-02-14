'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminImages() {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [category, setCategory] = useState('gallery');
    const [alt, setAlt] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [toast, setToast] = useState(null);
    const fileRef = useRef(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const [isDragging, setIsDragging] = useState(false);

    const loadImages = () => {
        const url = filterCategory ? `/api/images?category=${filterCategory}` : '/api/images';
        fetch(url)
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setImages(data); })
            .catch(() => { });
    };

    useEffect(() => { loadImages(); }, [filterCategory]);

    const processFiles = async (files) => {
        if (!files || files.length === 0) return;

        setUploading(true);

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', category);
            formData.append('alt', alt);

            try {
                const res = await fetch('/api/images/upload', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });

                if (res.ok) {
                    showToast(`${file.name} yüklendi`);
                } else {
                    showToast(`${file.name} yüklenemedi`, 'error');
                }
            } catch {
                showToast('Yükleme hatası', 'error');
            }
        }

        setUploading(false);
        setAlt('');
        if (fileRef.current) fileRef.current.value = '';
        loadImages();
    };

    const handleFileSelect = (e) => {
        processFiles(e.target.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bu görseli silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/images/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                showToast('Görsel silindi');
                loadImages();
            } else {
                showToast('Silinemedi', 'error');
            }
        } catch {
            showToast('Hata oluştu', 'error');
        }
    };

    return (
        <>
            <div className="admin-header">
                <h1>Görsel Yönetimi</h1>
            </div>

            {/* Upload Zone */}
            <div className="admin-form" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label>Kategori</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="shop">Mağaza Fotoğrafları</option>
                            <option value="maintenance">Teknik Servis</option>
                            <option value="gallery">Galeri</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label>Açıklama (Alt Text)</label>
                        <input
                            type="text"
                            value={alt}
                            onChange={(e) => setAlt(e.target.value)}
                            placeholder="Görsel açıklaması..."
                        />
                    </div>
                </div>

                <div
                    className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                        borderColor: isDragging ? 'var(--primary)' : 'var(--gray-300)',
                        backgroundColor: isDragging ? 'var(--primary-light)' : 'var(--white)',
                    }}
                >
                    <div className="upload-icon">{uploading ? '⏳' : '📁'}</div>
                    <p>{uploading ? 'Yükleniyor...' : isDragging ? 'Buraya Bırakın' : 'Görselleri yüklemek için tıklayın veya sürükleyin'}</p>
                    <p className="upload-hint">JPG, PNG, WebP • Maksimum 10MB</p>
                </div>
                <input
                    type="file"
                    ref={fileRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                />
            </div>

            {/* Filter & Grid */}
            <div className="admin-table-card">
                <div className="admin-table-header">
                    <h2>Yüklenen Görseller ({images.length})</h2>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--gray-300)' }}
                    >
                        <option value="">Tümü</option>
                        <option value="shop">Mağaza</option>
                        <option value="maintenance">Teknik Servis</option>
                        <option value="gallery">Galeri</option>
                    </select>
                </div>

                <div style={{ padding: '20px' }}>
                    {images.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-400)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🖼️</div>
                            <p>Henüz görsel yüklenmemiş</p>
                        </div>
                    ) : (
                        <div className="image-grid">
                            {images.map(img => (
                                <div className="image-grid-item" key={img.id}>
                                    <img src={`/uploads/${img.filename}`} alt={img.alt || ''} />
                                    <div className="image-actions">
                                        <button className="image-action-btn" onClick={() => handleDelete(img.id)} title="Sil">
                                            🗑️
                                        </button>
                                    </div>
                                    <div className="image-info">
                                        {img.category} • {img.originalName}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
        </>
    );
}
