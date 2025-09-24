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
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mobile-content container mx-auto px-4 py-6 pb-20 sm:pb-6">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
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
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{deck.title}</h1>
              <p className="text-muted-foreground">Study Mode</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              title="Reset study session"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{reviewed} / {total}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Reviewed: {reviewed}</span>
                  <span>Remaining: {remaining}</span>
                </div>
              </div>
            </CardContent>
          </Card>
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
          <div className="mt-8 text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-6xl">🎉</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Study Complete!</h3>
                    <p className="text-muted-foreground mb-4">
                      You&apos;ve reviewed all {total} cards in this deck.
                    </p>
                    <div className="flex space-x-2 justify-center">
                      <Button
                        variant="outline"
                        onClick={handleReset}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Study Again
                      </Button>
                      <Button
                        onClick={() => router.push(`/deck/${deckId}`)}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Manage Cards
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Study tips */}
        {!isComplete && (
          <div className="mt-8 mb-32 sm:mb-8 text-center">
            <div className="text-sm text-muted-foreground">
              <p>💡 <strong>Tips:</strong></p>
              <p>Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd> to flip • Press <kbd className="px-2 py-1 bg-muted rounded text-xs">1-6</kbd> to grade</p>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
