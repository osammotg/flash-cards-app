import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all decks, ordered by most recently updated
export const getDecks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("decks")
      .order("desc")
      .collect();
  },
});

// Get a specific deck by ID
export const getDeck = query({
  args: { id: v.id("decks") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Create a new deck
export const createDeck = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { title, description }) => {
    const now = Date.now();
    return await ctx.db.insert("decks", {
      title,
      description,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a deck
export const updateDeck = mutation({
  args: {
    id: v.id("decks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { id, title, description }) => {
    const now = Date.now();
    return await ctx.db.patch(id, {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      updatedAt: now,
    });
  },
});

// Delete a deck
export const deleteDeck = mutation({
  args: { id: v.id("decks") },
  handler: async (ctx, { id }) => {
    // First, delete all cards in this deck
    const cards = await ctx.db
      .query("cards")
      .withIndex("by_deck", (q) => q.eq("deckId", id))
      .collect();
    
    for (const card of cards) {
      await ctx.db.delete(card._id);
    }
    
    // Then delete the deck
    return await ctx.db.delete(id);
  },
});
