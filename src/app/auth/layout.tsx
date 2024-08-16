import Navbar from '@/components/navbar';
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}
export default function AuthLayout({children}: AuthLayoutProps) {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      {children}
    </div>
  );
}
