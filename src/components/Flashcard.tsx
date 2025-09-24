'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, RotateCw } from 'lucide-react';
import { Card as CardType, StudyGrade } from '@/lib/types';

interface FlashcardProps {
  card: CardType;
  onGrade: (quality: 0 | 1 | 2 | 3 | 4 | 5) => void;
  onNext: () => void;
  isComplete?: boolean;
}

const gradeLabels = [
  { value: 0, label: 'Again', color: 'bg-red-500 hover:bg-red-600' },
  { value: 1, label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600' },
  { value: 2, label: 'Good', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { value: 3, label: 'Easy', color: 'bg-green-500 hover:bg-green-600' },
  { value: 4, label: 'Perfect', color: 'bg-blue-500 hover:bg-blue-600' },
  { value: 5, label: 'Excellent', color: 'bg-purple-500 hover:bg-purple-700' },
];

export function Flashcard({ card, onGrade, onNext, isComplete = false }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
    setShowAnswer(false);
  }, [card._id]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const handleGrade = (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    onGrade(quality);
    setIsFlipped(false);
    setShowAnswer(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      handleFlip();
    } else if (e.key >= '1' && e.key <= '6') {
      e.preventDefault();
      const grade = parseInt(e.key) - 1 as 0 | 1 | 2 | 3 | 4 | 5;
      if (showAnswer) {
        handleGrade(grade);
      }
    }
  };

  if (isComplete) {
    return (
      <Card className="flashcard h-96 w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-bold">Study Complete!</h2>
          <p className="text-muted-foreground text-center">
            Great job! You&apos;ve finished all the cards in this deck.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div 
      className={`flashcard h-80 w-full max-w-2xl mx-auto mb-8 ${isFlipped ? 'flipped' : ''}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flashcard-inner">
        {/* Front of card */}
        <div className="flashcard-front bg-card border-2 border-border rounded-3xl shadow-lg">
          <div className="p-8 w-full">
            <div className="text-lg leading-relaxed">{card.front}</div>
            {card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-6">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Back of card */}
        <div className="flashcard-back bg-primary text-primary-foreground rounded-3xl shadow-lg">
          <div className="p-8 w-full">
            <div className="text-lg leading-relaxed">{card.back}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center mt-8">
        <Button
          variant="ghost"
          onClick={handleFlip}
          className="h-12 px-6 rounded-2xl"
        >
          {isFlipped ? (
            <>
              <RotateCcw className="mr-2 h-4 w-4" />
              Question
            </>
          ) : (
            <>
              <RotateCw className="mr-2 h-4 w-4" />
              Answer
            </>
          )}
        </Button>
      </div>

      {/* Grade buttons - only show when answer is revealed */}
      {showAnswer && (
        <div className="mt-8 mb-32 sm:mb-8">
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
            {gradeLabels.map(({ value, label, color }) => (
              <Button
                key={value}
                onClick={() => handleGrade(value as StudyGrade)}
                className={`${color} text-white h-12 text-sm font-medium rounded-2xl`}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="text-center text-xs text-muted-foreground mt-4">
            Press 1-6 or tap buttons
          </div>
        </div>
      )}
    </div>
  );
}
