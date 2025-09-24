import { Deck, Card } from './types';
import { api } from '../../convex/_generated/api';
import { useQuery, useMutation } from 'convex/react';
import { Id } from '../../convex/_generated/dataModel';

// Deck operations using Convex
export const deckRepo = {
  async list(): Promise<Deck[]> {
    // This will be replaced by useQuery in hooks
    throw new Error('Use useDecks hook instead of direct call');
  },

  async create(data: { title: string; description?: string }): Promise<Deck> {
    // This will be replaced by useMutation in hooks
    throw new Error('Use useDecks hook instead of direct call');
  },

  async update(id: string, data: { title?: string; description?: string }): Promise<Deck> {
    // This will be replaced by useMutation in hooks
    throw new Error('Use useDecks hook instead of direct call');
  },

  async remove(id: string): Promise<void> {
    // This will be replaced by useMutation in hooks
    throw new Error('Use useDecks hook instead of direct call');
  },
};

// Card operations using Convex
export const cardRepo = {
  async listByDeck(deckId: string): Promise<Card[]> {
    // This will be replaced by useQuery in hooks
    throw new Error('Use useCards hook instead of direct call');
  },

  async create(data: { deckId: string; front: string; back: string; tags?: string[] }): Promise<Card> {
    // This will be replaced by useMutation in hooks
    throw new Error('Use useCards hook instead of direct call');
  },

  async update(id: string, data: { front?: string; back?: string; tags?: string[] }): Promise<Card> {
    // This will be replaced by useMutation in hooks
    throw new Error('Use useCards hook instead of direct call');
  },

  async remove(id: string): Promise<void> {
    // This will be replaced by useMutation in hooks
    throw new Error('Use useCards hook instead of direct call');
  },

  async search(deckId: string, query: string): Promise<Card[]> {
    // This will be replaced by useQuery in hooks
    throw new Error('Use useCards hook instead of direct call');
  },
};
