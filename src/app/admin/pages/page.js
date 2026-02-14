'use client';

import { useState, useEffect } from 'react';

export default function AdminPages() {
    const [pages, setPages] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingPage, setEditingPage] = useState(null);
    const [form, setForm] = useState({ title: '', slug: '', content: '', isVisible: true, order: 0 });
    const [toast, setToast] = useState(null);

    // Section form
    const [showSectionForm, setShowSectionForm] = useState(false);
    const [sectionPageId, setSectionPageId] = useState(null);
    const [sectionForm, setSectionForm] = useState({ title: '', content: '', type: 'text', order: 0 });

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    const showToast = (msg, type = 'success') => {
        setToast({ message: msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadPages = () => {
        fetch('/api/admin/pages', { headers })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setPages(data); })
            .catch(() => { });
    };

    useEffect(() => { loadPages(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingPage ? `/api/pages/${editingPage.id}` : '/api/pages';
        const method = editingPage ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
            if (res.ok) {
                showToast(editingPage ? 'Sayfa güncellendi' : 'Sayfa oluşturuldu');
                setShowForm(false);
                setEditingPage(null);
                setForm({ title: '', slug: '', content: '', isVisible: true, order: 0 });
                loadPages();
            } else {
                const data = await res.json();
                showToast(data.error || 'Hata oluştu', 'error');
            }
        } catch {
            showToast('Bağlantı hatası', 'error');
        }
    };

    const handleEdit = (page) => {
        setEditingPage(page);
        setForm({
            title: page.title,
            slug: page.slug,
            content: page.content || '',
            isVisible: page.isVisible,
            order: page.order,
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bu sayfayı silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch(`/api/pages/${id}`, { method: 'DELETE', headers });
            if (res.ok) { showToast('Sayfa silindi'); loadPages(); }
            else showToast('Silinemedi', 'error');
        } catch { showToast('Hata', 'error'); }
    };

    const handleAddSection = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/sections', {
                method: 'POST',
                headers,
                body: JSON.stringify({ ...sectionForm, pageId: sectionPageId }),
            });
            if (res.ok) {
                showToast('Bölüm eklendi');
                setShowSectionForm(false);
                setSectionForm({ title: '', content: '', type: 'text', order: 0 });
                loadPages();
            } else {
                showToast('Hata oluştu', 'error');
            }
        } catch { showToast('Hata', 'error'); }
    };

    const handleDeleteSection = async (id) => {
        if (!confirm('Bu bölümü silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch(`/api/sections/${id}`, { method: 'DELETE', headers });
            if (res.ok) { showToast('Bölüm silindi'); loadPages(); }
        } catch { showToast('Hata', 'error'); }
    };

    return (
        <>
            <div className="admin-header">
                <h1>Sayfa Yönetimi</h1>
                <button className="btn btn-blue btn-sm" onClick={() => { setShowForm(true); setEditingPage(null); setForm({ title: '', slug: '', content: '', isVisible: true, order: 0 }); }}>
                    ➕ Yeni Sayfa
                </button>
            </div>

            {/* Page Form Modal */}
            {showForm && (
                <div className="admin-form" style={{ marginBottom: '24px' }}>
                    <h2 style={{ marginBottom: '20px' }}>{editingPage ? 'Sayfayı Düzenle' : 'Yeni Sayfa'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label>Başlık</label>
                                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>URL Slug (ör: hakkimizda)</label>
                                <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>İçerik / Açıklama</label>
                            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label>Sıra</label>
                                <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="form-group">
                                <label>Durum</label>
                                <select value={form.isVisible} onChange={e => setForm({ ...form, isVisible: e.target.value === 'true' })}>
                                    <option value="true">Görünür</option>
                                    <option value="false">Gizli</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="submit" className="btn btn-blue btn-sm">
                                {editingPage ? 'Güncelle' : 'Oluştur'}
                            </button>
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => { setShowForm(false); setEditingPage(null); }}>
                                İptal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Section Form */}
            {showSectionForm && (
                <div className="admin-form" style={{ marginBottom: '24px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Yeni Bölüm Ekle</h2>
                    <form onSubmit={handleAddSection}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label>Başlık</label>
                                <input type="text" value={sectionForm.title} onChange={e => setSectionForm({ ...sectionForm, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Tip</label>
                                <select value={sectionForm.type} onChange={e => setSectionForm({ ...sectionForm, type: e.target.value })}>
                                    <option value="text">Metin</option>
                                    <option value="gallery">Galeri</option>
                                    <option value="services">Hizmetler</option>
                                    <option value="hero">Hero Banner</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>İçerik</label>
                            <textarea value={sectionForm.content} onChange={e => setSectionForm({ ...sectionForm, content: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Sıra</label>
                            <input type="number" value={sectionForm.order} onChange={e => setSectionForm({ ...sectionForm, order: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="submit" className="btn btn-blue btn-sm">Ekle</button>
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowSectionForm(false)}>İptal</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Pages Table */}
            <div className="admin-table-card">
                <div className="admin-table-header">
                    <h2>Sayfalar ({pages.length})</h2>
                </div>
                {pages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-400)' }}>
                        <p>Henüz sayfa yok</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Başlık</th>
                                <th>Slug</th>
                                <th>Bölümler</th>
                                <th>Durum</th>
                                <th>Sıra</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages.map(page => (
                                <>
                                    <tr key={page.id}>
                                        <td style={{ fontWeight: 600 }}>{page.title}</td>
                                        <td><code style={{ background: 'var(--gray-100)', padding: '2px 8px', borderRadius: '4px' }}>/{page.slug}</code></td>
                                        <td>{page.sections?.length || 0} bölüm</td>
                                        <td>
                                            <span className={`status-badge ${page.isVisible ? 'active' : 'inactive'}`}>
                                                {page.isVisible ? 'Görünür' : 'Gizli'}
                                            </span>
                                        </td>
                                        <td>{page.order}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button className="btn btn-outline btn-sm" onClick={() => handleEdit(page)}>✏️</button>
                                                <button className="btn btn-outline btn-sm" onClick={() => { setSectionPageId(page.id); setShowSectionForm(true); }}>➕ Bölüm</button>
                                                {page.slug !== 'home' && (
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(page.id)}>🗑️</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Show sections */}
                                    {page.sections?.map(section => (
                                        <tr key={`s-${section.id}`} style={{ background: 'var(--gray-50)' }}>
                                            <td style={{ paddingLeft: '48px', color: 'var(--gray-500)' }}>↳ {section.title}</td>
                                            <td><span className="status-badge active">{section.type}</span></td>
                                            <td>{section.images?.length || 0} görsel</td>
                                            <td></td>
                                            <td>{section.order}</td>
                                            <td>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSection(section.id)}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
        </>
    );
}
