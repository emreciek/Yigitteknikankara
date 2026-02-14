# 🔧 Yiğit Teknik — Kombi Teknik Servis Web Sitesi

Kombi ve ısıtma sistemleri teknik servisi için profesyonel web sitesi. Next.js, Prisma ORM ve SQLite ile geliştirilmiştir.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Özellikler

- **Ana Sayfa** — Hero bölümü, hizmetler, fotoğraf galerisi ve iletişim bilgileri
- **Admin Paneli** — Görsel yükleme, sayfa/bölüm yönetimi, iletişim düzenleme
- **Dinamik Sayfalar** — Admin panelinden oluşturulan sayfalar otomatik olarak yayınlanır
- **Responsive Tasarım** — Masaüstü, tablet ve mobil cihazlarda uyumlu
- **JWT Kimlik Doğrulama** — Güvenli admin girişi
- **Görsel Yükleme** — Kategori bazlı görsel yönetimi (mağaza, teknik servis, galeri)

## 🚀 Kurulum

### Gereksinimler

- [Node.js](https://nodejs.org/) (v18 veya üzeri)
- npm (Node.js ile birlikte gelir)

### Adımlar

```bash
# 1. Repoyu klonlayın
git clone https://github.com/KULLANICI_ADINIZ/yigitteknik.git
cd yigitteknik

# 2. Bağımlılıkları yükleyin
npm install

# 3. Ortam değişkenlerini ayarlayın
copy .env.example .env

# 4. Veritabanını oluşturun ve varsayılan verileri ekleyin
npx prisma db push
node prisma/seed.js

# 5. Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda **http://localhost:3000** adresini açın.

## 🔑 Admin Girişi

| Alan           | Değer          |
|----------------|----------------|
| URL            | `/admin/login` |
| Kullanıcı Adı  | `admin`        |
| Şifre          | `admin123`     |

> ⚠️ İlk girişten sonra şifrenizi değiştirmeniz önerilir.

## 📁 Proje Yapısı

```
├── prisma/
│   ├── schema.prisma        # Veritabanı modelleri
│   └── seed.js              # Varsayılan veri oluşturucu
├── public/
│   ├── logo.png             # Site logosu
│   └── uploads/             # Yüklenen görseller
├── src/
│   ├── app/
│   │   ├── globals.css      # Tasarım sistemi (mavi/beyaz tema)
│   │   ├── layout.js        # Ana layout
│   │   ├── page.js          # Ana sayfa
│   │   ├── iletisim/        # İletişim sayfası
│   │   ├── [slug]/          # Dinamik sayfa şablonu
│   │   ├── admin/           # Admin paneli
│   │   └── api/             # API endpoint'leri
│   ├── components/          # Navbar, Footer bileşenleri
│   └── lib/                 # Prisma client, JWT auth
└── package.json
```

## 🛠️ Kullanılabilir Komutlar

| Komut               | Açıklama                              |
|----------------------|---------------------------------------|
| `npm run dev`        | Geliştirme sunucusunu başlatır        |
| `npm run build`      | Üretim için derleme yapar             |
| `npm start`          | Üretim sunucusunu başlatır            |
| `npm run db:push`    | Veritabanı şemasını günceller         |
| `npm run db:seed`    | Varsayılan verileri ekler             |
| `npm run db:setup`   | Şema + seed birlikte çalıştırır      |

## 🗄️ Veritabanı

Proje varsayılan olarak **SQLite** kullanır (sıfır kurulum). PostgreSQL'e geçmek için:

1. `prisma/schema.prisma` dosyasında `provider`'ı `"postgresql"` olarak değiştirin
2. `.env` dosyasında `DATABASE_URL`'i PostgreSQL bağlantı dizesiyle güncelleyin
3. `npx prisma db push` komutunu çalıştırın

## 📡 API Endpoint'leri

| Metod  | Endpoint               | Açıklama                    | Yetki    |
|--------|------------------------|-----------------------------|----------|
| POST   | `/api/auth/login`      | Admin girişi                | Herkese açık  |
| GET    | `/api/auth/verify`     | Token doğrulama             | Admin    |
| GET    | `/api/pages`           | Sayfaları listele           | Herkese açık  |
| POST   | `/api/pages`           | Sayfa oluştur               | Admin    |
| PUT    | `/api/pages/[id]`      | Sayfa güncelle              | Admin    |
| DELETE | `/api/pages/[id]`      | Sayfa sil                   | Admin    |
| GET    | `/api/sections`        | Bölümleri listele           | Herkese açık  |
| POST   | `/api/sections`        | Bölüm oluştur              | Admin    |
| GET    | `/api/images`          | Görselleri listele          | Herkese açık  |
| POST   | `/api/images/upload`   | Görsel yükle                | Admin    |
| DELETE | `/api/images/[id]`     | Görsel sil                  | Admin    |
| GET    | `/api/contact`         | İletişim bilgisi            | Herkese açık  |
| PUT    | `/api/contact`         | İletişim güncelle           | Admin    |

## 📄 Lisans

MIT License — Serbestçe kullanabilir ve değiştirebilirsiniz.
