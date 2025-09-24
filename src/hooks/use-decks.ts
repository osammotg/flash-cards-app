import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export function useDecks() {
  const decks = useQuery(api.decks.getDecks) || [];
  const createDeckMutation = useMutation(api.decks.createDeck);
  const updateDeckMutation = useMutation(api.decks.updateDeck);
  const removeDeckMutation = useMutation(api.decks.deleteDeck);

  const createDeck = async (data: { title: string; description?: string }) => {
    try {
      const deckId = await createDeckMutation(data);
      return { _id: deckId, _creationTime: Date.now(), ...data, createdAt: Date.now(), updatedAt: Date.now() };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create deck');
    }
  };

  const updateDeck = async (id: string, data: { title?: string; description?: string }) => {
    try {
      await updateDeckMutation({ id: id as Id<"decks">, ...data });
      return { _id: id as Id<"decks">, ...data };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update deck');
    }
  };

  const removeDeck = async (id: string) => {
    try {
      await removeDeckMutation({ id: id as Id<"decks"> });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to remove deck');
    }
  };

  return {
    decks,
    loading: decks === undefined,
    error: null,
    createDeck,
    updateDeck,
    removeDeck,
    refresh: () => {}, // Convex handles this automatically
  };
}
