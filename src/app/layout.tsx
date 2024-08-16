import QueryProvider from '@/providers/query-provider';
import {SessionProvider} from 'next-auth/react';
import {ThemeProvider} from '@/providers';
import {Toaster} from 'react-hot-toast';
import {Inter} from 'next/font/google';
import type {Metadata} from 'next';
import {auth} from '../../auth';
import './globals.css';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Video chat',
  description: 'It is video chat',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <QueryProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Toaster />
              {children}
            </ThemeProvider>
          </body>
        </html>
      </QueryProvider>
    </SessionProvider>
  );
}
