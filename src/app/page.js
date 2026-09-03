'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const serviceIcons = ['🔧', '⚙️', '🏗️', '🚨', '🔥', '💨'];

export default function HomePage() {
  const [sections, setSections] = useState([]);
  const [images, setImages] = useState([]);
  const [contact, setContact] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Fetch services (dynamic)
    fetch('/api/services')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setServices(data); })
      .catch(() => { });

    // Fetch homepage sections (hero, gallery setup)
    fetch('/api/pages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const homePage = data.find(p => p.slug === 'home');
          if (homePage) setSections(homePage.sections || []);
        }
      })
      .catch(() => { });

    // Fetch gallery images
    fetch('/api/images')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setImages(data); })
      .catch(() => { });

    // Fetch contact info
    fetch('/api/contact')
      .then(res => res.json())
      .then(data => setContact(data))
      .catch(() => { });
  }, []);

  const heroSection = sections.find(s => s.type === 'hero');
  const servicesSection = sections.find(s => s.type === 'services');
  const gallerySection = sections.find(s => s.type === 'gallery');

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="fade-in-up">
              {heroSection ? heroSection.title : 'Profesyonel Kombi '}
              <span className="highlight">Teknik Servisi</span>
            </h1>
            <p className="fade-in-up delay-1">
              {heroSection?.content || 'Kombi bakım, onarım ve montaj hizmetlerinde uzman ekibimizle yanınızdayız. 7/24 acil servis hizmeti.'}
            </p>
            <div className="hero-buttons fade-in-up delay-2">
              <a href={`tel:${contact?.phone || '+902125550123'}`} className="btn btn-primary">📞 Hemen Ara</a>
              <a href="/iletisim" className="btn btn-secondary">📍 Bize Ulaşın</a>
            </div>
            <div className="hero-stats fade-in-up delay-3">
              <div className="hero-stat">
                <div className="stat-number">15+</div>
                <div className="stat-label">Yıllık Deneyim</div>
              </div>
              <div className="hero-stat">
                <div className="stat-number">5000+</div>
                <div className="stat-label">Mutlu Müşteri</div>
              </div>
              <div className="hero-stat">
                <div className="stat-number">7/24</div>
                <div className="stat-label">Acil Servis</div>
              </div>
            </div>
          </div>

          <div className="hero-visual fade-in-up delay-2">
            <div className="hero-image-grid">
              {images.length > 0 ? (
                <>
                  <div className="hero-image-card" style={{ position: 'relative', height: '100%', minHeight: '300px' }}>
                    <Image
                      src={images[0].filename.startsWith('http') ? images[0].filename : `/uploads/${images[0].filename}`}
                      alt={images[0].alt || 'Yiğit Teknik'}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority
                      loading="eager"
                    />
                  </div>
                  {images[1] && (
                    <div className="hero-image-card" style={{ position: 'relative', height: '100%', minHeight: '300px' }}>
                      <Image
                        src={images[1].filename.startsWith('http') ? images[1].filename : `/uploads/${images[1].filename}`}
                        alt={images[1].alt || 'Teknik Servis'}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority
                        loading="eager"
                      />
                    </div>
                  )}
                  {images[2] && (
                    <div className="hero-image-card" style={{ position: 'relative', height: '100%', minHeight: '300px' }}>
                      <Image
                        src={images[2].filename.startsWith('http') ? images[2].filename : `/uploads/${images[2].filename}`}
                        alt={images[2].alt || 'Kombi Bakım'}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority
                        loading="eager"
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="hero-image-card">🔧</div>
                  <div className="hero-image-card">⚙️</div>
                  <div className="hero-image-card">🏗️</div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section section-alt" id="hizmetler">
        <div className="container">
          <div className="section-header">
            <div className="badge">⚙️ Hizmetlerimiz</div>
            <h2>{servicesSection?.title || 'Hizmetlerimiz'}</h2>
            <p>Her türlü kombi ve ısıtma sistemi ihtiyacınız için profesyonel çözümler sunuyoruz.</p>
          </div>
          <div className="services-grid">
            {services.length > 0 ? services.map((service, i) => (
              <div className="service-card fade-in-up" key={service.id || i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="service-icon">
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl.startsWith('http') ? service.imageUrl : `/uploads/${service.imageUrl}`}
                      alt={service.title}
                      width={64}
                      height={64}
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    // Fallback to simple generic icon if no image (avoiding emojis as requested)
                    <div style={{ width: '64px', height: '64px', background: 'var(--primary)', maskImage: 'url(/icon.png)', maskSize: 'contain', WebkitMaskImage: 'url(/icon.png)', WebkitMaskSize: 'contain' }}></div>
                  )}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            )) : (
              <p style={{ textAlign: 'center', width: '100%', padding: '20px' }}>Hizmetler yükleniyor veya henüz eklenmedi.</p>
            )}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section" id="galeri">
        <div className="container">
          <div className="section-header">
            <div className="badge">📸 Galeri</div>
            <h2>{gallerySection?.title || 'Çalışmalarımız'}</h2>
            <p>{gallerySection?.content || 'Gerçekleştirdiğimiz teknik servis çalışmalarından kareler.'}</p>
          </div>
          <div className="gallery-grid">
            {images.length > 0 ? images.map((img) => (
              <div className="gallery-item" key={img.id} style={{ position: 'relative', height: '300px' }}>
                <Image
                  src={img.filename.startsWith('http') ? img.filename : `/uploads/${img.filename}`}
                  alt={img.alt || 'Teknik servis çalışması'}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="gallery-overlay">
                  <span>{img.alt || img.category}</span>
                </div>
              </div>
            )) : (
              <>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div className="gallery-item" key={i}>
                    <div className="gallery-placeholder">🔧</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-blue">
        <div className="container cta-section">
          <h2>Kombiniz İçin Profesyonel Destek</h2>
          <p>Hemen bizi arayın, uzman ekibimiz en kısa sürede size ulaşsın.</p>
          <div className="cta-buttons">
            <a href={`tel:${contact?.phone || '+902125550123'}`} className="btn btn-primary">
              📞 {contact?.phone || '+90 (212) 555 0123'}
            </a>
            <a href="/iletisim" className="btn btn-secondary">📍 Adresimiz</a>
          </div>
        </div>
      </section>

      {/* CONTACT PREVIEW */}
      <section className="section section-alt" id="iletisim">
        <div className="container">
          <div className="section-header">
            <div className="badge">📍 İletişim</div>
            <h2>Bize Ulaşın</h2>
            <p>Sorularınız ve randevu talepleriniz için bize ulaşabilirsiniz.</p>
          </div>
          <div className="contact-grid">
            <div className="contact-info-cards">
              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <div>
                  <h3>Adres</h3>
                  <p>{contact?.address || 'Yükleniyor...'}</p>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <div>
                  <h3>Telefon</h3>
                  <p>{contact?.phone || 'Yükleniyor...'}</p>
                </div>
              </div>
              {contact?.instagram && (
                <div className="contact-card">
                  <div className="contact-icon">📸</div>
                  <div>
                    <h3>Instagram</h3>
                    <p>
                      <a href={contact.instagram.startsWith('http') ? contact.instagram : `https://instagram.com/${contact.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
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
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🗺️</div>
                <p>Harita yükleniyor...</p>
                <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Admin panelinden harita URL&#39;si ekleyebilirsiniz</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
