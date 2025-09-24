import { Id } from '../../convex/_generated/dataModel';

export type Deck = {
  _id: Id<"decks">;
  _creationTime: number;
  title: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
};

export type Card = {
  _id: Id<"cards">;
  _creationTime: number;
  deckId: Id<"decks">;
  front: string;
  back: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
};

export type StudySession = {
  deckId: string;
  currentCardIndex: number;
  totalCards: number;
  reviewedCards: number;
  startTime: number;
};

export type StudyGrade = 0 | 1 | 2 | 3 | 4 | 5;
