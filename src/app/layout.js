import './globals.css';

export const metadata = {
  title: 'Yiğit Teknik - Profesyonel Kombi Teknik Servisi',
  description: 'Kombi bakım, onarım ve montaj hizmetlerinde uzman ekibimizle yanınızdayız. 7/24 acil servis hizmeti.',
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        {children}
      </body>
    </html>
  );
}
