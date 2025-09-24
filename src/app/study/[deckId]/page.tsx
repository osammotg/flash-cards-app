'use client';

import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Flashcard } from '@/components/Flashcard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDecks } from '@/hooks/use-decks';
import { useStudyQueue } from '@/hooks/use-study-queue';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, RotateCcw, BookOpen } from 'lucide-react';
import { FullScreenLoader } from '@/components/Loader';

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;

  const { decks } = useDecks();
  const { 
    current, 
    remaining, 
    total, 
    reviewed, 
    loading, 
    next, 
    grade, 
    reset, 
    isComplete 
  } = useStudyQueue(deckId);
  
  const { toast } = useToast();

  const deck = decks.find(d => d._id === deckId);

  useEffect(() => {
    // Focus management for keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        // Flashcard component handles this
      } else if (e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        // Flashcard component handles this
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!deck) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mobile-content container mx-auto px-4 py-6 pb-20 sm:pb-6">
          <EmptyState
            icon="❌"
            title="Deck not found"
            description="The deck you're looking for doesn't exist."
            action={{
              label: 'Go Home',
              onClick: () => router.push('/'),
            }}
          />
        </main>
        <BottomNav />
      </div>
    );
  }

  if (loading) {
    return <FullScreenLoader />;
  }

  if (total === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mobile-content container mx-auto px-4 py-6 pb-20 sm:pb-6">
          <EmptyState
            icon="📚"
            title="No cards to study"
            description="This deck doesn't have any cards yet. Add some cards to start studying."
            action={{
              label: 'Add Cards',
              onClick: () => router.push(`/deck/${deckId}`),
            }}
          />
        </main>
        <BottomNav />
      </div>
    );
  }

  const handleGrade = (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    grade(quality);
    
    // Show toast feedback based on grade
    const feedback = [
      'Keep practicing!',
      'You\'re getting there!',
      'Good job!',
      'Well done!',
      'Excellent!',
      'Perfect!'
    ];
    
    toast({
      title: feedback[quality],
      description: quality >= 3 ? 'Great work!' : 'Keep studying to improve!',
    });
  };

  const handleReset = () => {
    reset();
    toast({
      title: 'Study session reset',
      description: 'You can start studying again from the beginning.',
    });
  };

  const progressPercentage = total > 0 ? (reviewed / total) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mobile-content container mx-auto px-4 py-6 pb-20 sm:pb-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">{deck.title}</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="h-10 w-10"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>{reviewed} of {total}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Flashcard */}
        <div className="flex justify-center mb-8">
          {current && (
            <Flashcard
              card={current}
              onGrade={handleGrade}
              onNext={next}
              isComplete={isComplete}
            />
          )}
        </div>

        {/* Study complete */}
        {isComplete && (
          <div className="mt-12 text-center">
            <div className="space-y-6">
              <div className="text-6xl">🎉</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Complete</h3>
                <p className="text-muted-foreground mb-6">
                  All {total} cards reviewed
                </p>
                <div className="flex space-x-3 justify-center">
                  <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="h-12 px-6 rounded-2xl"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Again
                  </Button>
                  <Button
                    onClick={() => router.push(`/deck/${deckId}`)}
                    className="h-12 px-6 rounded-2xl"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Study tips */}
        {!isComplete && (
          <div className="mt-12 mb-32 sm:mb-8 text-center">
            <div className="text-xs text-muted-foreground">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd> to flip • <kbd className="px-2 py-1 bg-muted rounded text-xs">1-6</kbd> to grade
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
