import { useState, useEffect, useCallback } from 'react';
import { Card, StudyGrade } from '@/lib/types';
import { cardRepo } from '@/lib/data';

export function useStudyQueue(deckId: string) {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cardList = await cardRepo.listByDeck(deckId);
      setCards(cardList);
      setCurrentIndex(0);
      setReviewedCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    if (deckId) {
      loadCards();
    }
  }, [deckId, loadCards]);

  const current = cards[currentIndex] || null;
  const remaining = cards.length - currentIndex;
  const total = cards.length;

  const next = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const grade = (quality: StudyGrade) => {
    // TODO: Implement spaced repetition algorithm
    // For now, just move to next card
    setReviewedCount(prev => prev + 1);
    next();
  };

  const reset = () => {
    setCurrentIndex(0);
    setReviewedCount(0);
  };

  const isComplete = currentIndex >= cards.length;

  return {
    current,
    remaining,
    total,
    reviewed: reviewedCount,
    loading,
    error,
    next,
    grade,
    reset,
    isComplete,
    refresh: loadCards,
  };
}
