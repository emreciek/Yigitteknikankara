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
        // Capture current state in closure or use simplified logic
        // Since we are inside a function component, these values are fresh when processFiles is called from handleFileSelect
        // But for the useEffect listener, we need to be careful. 
        // We will pass the function to the listener, but the listener is bound on mount.
        // Actually, we can just use the state directly if we include it in dependency array of useEffect, 
        // OR we can use refs for mutable state that doesn't trigger re-binds.
        // For simplicity and safety against stale closures in event listeners, let's use the refs approach for the values if we were strictly binding once.
        // However, re-binding on state change is fine for this scale.

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
                    const errorText = await res.text();
                    console.error('Upload failed:', res.status, errorText);
                    showToast(`Yüklenemedi (${res.status})`, 'error');
                }
            } catch (error) {
                console.error('Upload error:', error);
                showToast('Hata: ' + error.message, 'error');
            }
        }

        setUploading(false);
        setAlt('');
        if (fileRef.current) fileRef.current.value = '';
        loadImages();
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
        }
    };

    // Native drag and drop handling to ensure preventDefault works
    useEffect(() => {
        const dropZone = document.getElementById('drop-zone');
        if (!dropZone) return;

        const handleNativeDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        };

        const handleNativeDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
        };

        const handleNativeDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                processFiles(files);
            }
        };

        // Global prevent default to stop browser from opening files if missed
        const handleGlobalDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        const handleGlobalDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        dropZone.addEventListener('dragover', handleNativeDragOver);
        dropZone.addEventListener('dragleave', handleNativeDragLeave);
        dropZone.addEventListener('drop', handleNativeDrop);

        window.addEventListener('dragover', handleGlobalDragOver);
        window.addEventListener('drop', handleGlobalDrop);

        return () => {
            dropZone.removeEventListener('dragover', handleNativeDragOver);
            dropZone.removeEventListener('dragleave', handleNativeDragLeave);
            dropZone.removeEventListener('drop', handleNativeDrop);

            window.removeEventListener('dragover', handleGlobalDragOver);
            window.removeEventListener('drop', handleGlobalDrop);
        };
    }, [category, alt]); // Re-bind when state changes so processFiles has correct closure values

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
                    id="drop-zone"
                    className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                    onClick={() => fileRef.current?.click()}
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
