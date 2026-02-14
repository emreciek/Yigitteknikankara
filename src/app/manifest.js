export default function manifest() {
    return {
        name: 'Yiğit Teknik Ankara',
        short_name: 'Yiğit Teknik',
        description: 'Profesyonel Kombi Bakım ve Onarım Servisi',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
            {
                src: '/favicon.ico',
                sizes: '32x32',
                type: 'image/x-icon',
            },
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/apple-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    }
}
