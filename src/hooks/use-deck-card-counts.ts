import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useDeckCardCounts() {
  const cardCounts = useQuery(api.cards.getCardCountsByDeck);
  
  return {
    cardCounts: cardCounts || {},
    loading: cardCounts === undefined,
  };
}
