'use client';

import { useEffect } from 'react';

export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { useDecks } from '@/hooks/use-decks';
import { Header } from '@/components/Header';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';

export default function StudyPage() {
  const router = useRouter();
  const { decks, loading } = useDecks();

  useEffect(() => {
    if (!loading && decks.length > 0) {
      // Redirect to the first deck
      router.push(`/study/${decks[0]._id}`);
    }
  }, [decks, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mobile-content container mx-auto px-4 py-6 pb-20 sm:pb-6">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mobile-content container mx-auto px-4 py-6 pb-20 sm:pb-6">
          <EmptyState
            icon="📚"
            title="No decks to study"
            description="Create your first deck and add some cards to start studying."
            action={{
              label: 'Create Deck',
              onClick: () => router.push('/'),
            }}
          />
        </main>
      </div>
    );
  }

  return null; // Will redirect
}
