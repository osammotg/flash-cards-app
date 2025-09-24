'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/study', label: 'Study', icon: BookOpen },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href === '/study' && pathname.startsWith('/study'));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center space-y-1 rounded-2xl px-4 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
