'use client';

import { Flower, Users, Crown } from 'lucide-react';
import { UserButton, useUser } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Header() {
  const user = useUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Flower className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Blossom</span>
        </Link>
        
        <div className="flex items-center space-x-1">
          {user && (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/teams" className="h-9 w-9">
                  <Users className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/plans" className="h-9 w-9">
                  <Crown className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
          <UserButton />
        </div>
      </div>
    </header>
  );
}
