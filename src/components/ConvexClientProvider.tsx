'use client';

import { ConvexProvider } from 'convex/react';
import { ConvexReactClient } from 'convex/react';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.error('NEXT_PUBLIC_CONVEX_URL is not set!');
}

const convex = new ConvexReactClient(convexUrl!);

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
