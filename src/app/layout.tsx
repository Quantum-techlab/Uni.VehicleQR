import type { Metadata } from 'next';
import { AuthProvider } from '@/components/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import './globals.css';
import { Icons } from '@/components/icons';

export const metadata: Metadata = {
  title: 'UniIlorin VehiclePass',
  description: 'Vehicle Verification System for University of Ilorin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const faviconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
      <g fill="%23800000">
        <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
        <path d="M168 96h-24v-8a16 16 0 0 0-32 0v8h-24a8 8 0 0 0-8 8v72a8 8 0 0 0 8 8h80a8 8 0 0 0 8-8v-72a8 8 0 0 0-8-8Zm-40-8a8 8 0 0 1 16 0v8h-16Zm40 80h-8v-8a8 8 0 0 0-16 0v8h-24v-8a8 8 0 0 0-16 0v8h-8v-56h80Z" />
      </g>
    </svg>
  `;
  const faviconDataUrl = `data:image/svg+xml,${faviconSvg.replace(/\n/g, '').replace(/\s+/g, ' ')}`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={faviconDataUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Source+Code+Pro:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
        )}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
