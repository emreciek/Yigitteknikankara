'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/services')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setServices(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setServices(services.filter(s => s.id !== id));
            } else {
                alert('Silme işlemi başarısız oldu.');
            }
        } catch (error) {
            console.error(error);
            alert('Bir hata oluştu.');
        }
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div className="admin-page">
            <header className="page-header">
                <h1>⚙️ Hizmetler</h1>
                <Link href="/admin/services/new" className="btn btn-primary">➕ Yeni Hizmet Ekle</Link>
            </header>

            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Görsel</th>
                            <th>Başlık</th>
                            <th>Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.length > 0 ? services.map(service => (
                            <tr key={service.id}>
                                <td>
                                    {service.imageUrl ? (
                                        <img
                                            src={service.imageUrl.startsWith('http') ? service.imageUrl : `/uploads/${service.imageUrl}`}
                                            alt={service.title}
                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: '1.5rem' }}>🔧</span>
                                    )}
                                </td>
                                <td>{service.title}</td>
                                <td>
                                    <span className={`status-badge ${service.active ? 'active' : 'inactive'}`}>
                                        {service.active ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <Link href={`/admin/services/${service.id}`} className="btn btn-sm btn-outline">✏️ Düzenle</Link>
                                        <button onClick={() => handleDelete(service.id)} className="btn btn-sm btn-danger">🗑️ Sil</button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colspan="4" style={{ textAlign: 'center', padding: '20px' }}>Henüz hiç hizmet eklenmemiş.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
