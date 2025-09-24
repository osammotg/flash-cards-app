'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { FullScreenLoader } from '@/components/Loader';

export default function ConvexTestPage() {
  const decks = useQuery(api.decks.getDecks);

  console.log('ConvexTest - Environment URL:', process.env.NEXT_PUBLIC_CONVEX_URL);
  console.log('ConvexTest - Decks query result:', decks);
  console.log('ConvexTest - Is loading:', decks === undefined);

  if (decks === undefined) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Convex Connection Test</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Environment</h2>
            <p>Convex URL: {process.env.NEXT_PUBLIC_CONVEX_URL || 'Not set'}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold">Query Status</h2>
            <p>Loading: {decks === undefined ? 'true' : 'false'}</p>
            <p>Decks count: {decks?.length || 0}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold">Raw Data</h2>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(decks, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
