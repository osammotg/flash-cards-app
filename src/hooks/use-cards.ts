import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export function useCards(deckId: string) {
  const cards = useQuery(api.cards.getCardsByDeck, { deckId: deckId as Id<"decks"> }) || [];
  const createCardMutation = useMutation(api.cards.createCard);
  const updateCardMutation = useMutation(api.cards.updateCard);
  const removeCardMutation = useMutation(api.cards.deleteCard);
  const searchCardsQuery = useQuery(api.cards.searchCards, { deckId: deckId as Id<"decks">, query: "" });

  const createCard = async (data: { front: string; back: string; tags?: string[] }) => {
    try {
      const cardId = await createCardMutation({ deckId: deckId as Id<"decks">, ...data });
      return { _id: cardId, _creationTime: Date.now(), deckId: deckId as Id<"decks">, ...data, createdAt: Date.now(), updatedAt: Date.now() };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create card');
    }
  };

  const updateCard = async (id: string, data: { front?: string; back?: string; tags?: string[] }) => {
    try {
      await updateCardMutation({ id: id as Id<"cards">, ...data });
      return { _id: id as Id<"cards">, ...data };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update card');
    }
  };

  const removeCard = async (id: string) => {
    try {
      await removeCardMutation({ id: id as Id<"cards"> });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to remove card');
    }
  };

  const searchCards = async (query: string) => {
    try {
      // For now, we'll do client-side filtering since Convex search is more complex
      const lowercaseQuery = query.toLowerCase();
      return cards.filter(card => 
        card.front.toLowerCase().includes(lowercaseQuery) ||
        card.back.toLowerCase().includes(lowercaseQuery) ||
        card.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to search cards');
    }
  };

  return {
    cards,
    loading: cards === undefined,
    error: null,
    createCard,
    updateCard,
    removeCard,
    searchCards,
    refresh: () => {}, // Convex handles this automatically
  };
}
