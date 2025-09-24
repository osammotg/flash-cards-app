'use client';

import { useDecks } from '@/hooks/use-decks';
import { FullScreenLoader } from '@/components/Loader';

export default function DebugPage() {
  const { decks, loading } = useDecks();

  console.log('Debug - Loading:', loading);
  console.log('Debug - Decks:', decks);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Debug Page</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Loading State</h2>
            <p className="text-lg">Loading: {loading ? 'true' : 'false'}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Decks Count</h2>
            <p className="text-lg">Decks: {decks.length}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Decks Data</h2>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">
              {JSON.stringify(decks, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
