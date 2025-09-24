'use client';

import { Flower } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-2">
          <Flower className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Blossom</span>
        </div>
      </div>
    </header>
  );
}
