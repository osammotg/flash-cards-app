'use client';

import { Flower, Users } from 'lucide-react';
import { UserButton, useUser } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Header() {
  const user = useUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Flower className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Blossom</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          {user && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/teams" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Teams
              </Link>
            </Button>
          )}
          <UserButton />
        </div>
      </div>
    </header>
  );
}
