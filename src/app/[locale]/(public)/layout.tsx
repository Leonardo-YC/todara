'use client';

import { use } from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function PublicLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar locale={locale} />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter locale={locale} />
    </div>
  );
}