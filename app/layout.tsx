import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
const inter = Inter({ subsets: ['latin'] });
import RootProviders from '@/components/providers/RootProviders';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'V-Coin Management',
  description: 'Quản lý tiền tệ của bạn một cách dễ dàng',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" style={{ colorScheme: 'dark' }}>
        <body className={inter.className}>
          <Toaster richColors position="bottom-right" />
          <RootProviders>{children}</RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
