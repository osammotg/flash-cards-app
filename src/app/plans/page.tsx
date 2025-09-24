'use client';

import { Header } from '@/components/Header';
import { PremiumPlan } from '@/components/PremiumPlan';

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock the full potential of collaborative learning with our premium features
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <PremiumPlan />
        </div>
      </main>
    </div>
  );
}
