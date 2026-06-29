import type {Metadata} from 'next';
import {Inter, JetBrains_Mono} from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dog Medication Dosage by Weight | Benadryl, Gabapentin, Trazodone & More',
  description: 'Calculate common dog medication dosages by weight with easy, fast, and clear calculators. Includes Benadryl, Gabapentin, Trazodone, Amoxicillin, and more.',
  metadataBase: new URL('https://gesime-admin.github.io/dog-dosage-calculator'),
  alternates: { canonical: 'https://gesime-admin.github.io/dog-dosage-calculator/' },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

