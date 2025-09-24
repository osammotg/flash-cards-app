import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all cards for a specific deck
export const getCardsByDeck = query({
  args: { deckId: v.id("decks") },
  handler: async (ctx, { deckId }) => {
    return await ctx.db
      .query("cards")
      .withIndex("by_deck", (q) => q.eq("deckId", deckId))
      .order("desc")
      .collect();
  },
});

// Get a specific card by ID
export const getCard = query({
  args: { id: v.id("cards") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Create a new card
export const createCard = mutation({
  args: {
    deckId: v.id("decks"),
    front: v.string(),
    back: v.string(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { deckId, front, back, tags = [] }) => {
    const now = Date.now();
    return await ctx.db.insert("cards", {
      deckId,
      front,
      back,
      tags,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a card
export const updateCard = mutation({
  args: {
    id: v.id("cards"),
    front: v.optional(v.string()),
    back: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { id, front, back, tags }) => {
    const now = Date.now();
    return await ctx.db.patch(id, {
      ...(front !== undefined && { front }),
      ...(back !== undefined && { back }),
      ...(tags !== undefined && { tags }),
      updatedAt: now,
    });
  },
});

// Delete a card
export const deleteCard = mutation({
  args: { id: v.id("cards") },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});

// Search cards in a deck
export const searchCards = query({
  args: {
    deckId: v.id("decks"),
    query: v.string(),
  },
  handler: async (ctx, { deckId, query }) => {
    const cards = await ctx.db
      .query("cards")
      .withIndex("by_deck", (q) => q.eq("deckId", deckId))
      .collect();
    
    const lowercaseQuery = query.toLowerCase();
    
    return cards.filter(card => 
      card.front.toLowerCase().includes(lowercaseQuery) ||
      card.back.toLowerCase().includes(lowercaseQuery) ||
      card.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  },
});
