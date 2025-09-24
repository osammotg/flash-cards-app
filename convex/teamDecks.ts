import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all decks for a team
export const getTeamDecks = query({
  args: { teamId: v.string() },
  handler: async (ctx, { teamId }) => {
    return await ctx.db
      .query("decks")
      .withIndex("by_team", (q) => q.eq("teamId", teamId))
      .order("desc")
      .collect();
  },
});

// Get a specific team deck
export const getTeamDeck = query({
  args: { deckId: v.id("decks"), teamId: v.string() },
  handler: async (ctx, { deckId, teamId }) => {
    const deck = await ctx.db.get(deckId);
    if (!deck || deck.teamId !== teamId) {
      return null;
    }
    return deck;
  },
});

// Create deck for team
export const createTeamDeck = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    teamId: v.string(),
    ownerId: v.string(),
  },
  handler: async (ctx, { title, description, teamId, ownerId }) => {
    const now = Date.now();
    return await ctx.db.insert("decks", {
      title,
      description,
      teamId,
      ownerId,
      isPublic: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update team deck
export const updateTeamDeck = mutation({
  args: {
    deckId: v.id("decks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    teamId: v.string(),
  },
  handler: async (ctx, { deckId, title, description, teamId }) => {
    const deck = await ctx.db.get(deckId);
    if (!deck || deck.teamId !== teamId) {
      throw new Error("Deck not found or not in team");
    }
    
    const now = Date.now();
    await ctx.db.patch(deckId, {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      updatedAt: now,
    });
  },
});

// Delete team deck
export const deleteTeamDeck = mutation({
  args: { deckId: v.id("decks"), teamId: v.string() },
  handler: async (ctx, { deckId, teamId }) => {
    const deck = await ctx.db.get(deckId);
    if (!deck || deck.teamId !== teamId) {
      throw new Error("Deck not found or not in team");
    }
    
    // First, delete all cards in this deck
    const cards = await ctx.db
      .query("cards")
      .withIndex("by_deck_team", (q) => q.eq("deckId", deckId).eq("teamId", teamId))
      .collect();
    
    for (const card of cards) {
      await ctx.db.delete(card._id);
    }
    
    // Then delete the deck
    await ctx.db.delete(deckId);
  },
});

// Get team cards for a deck
export const getTeamCards = query({
  args: { deckId: v.id("decks"), teamId: v.string() },
  handler: async (ctx, { deckId, teamId }) => {
    return await ctx.db
      .query("cards")
      .withIndex("by_deck_team", (q) => 
        q.eq("deckId", deckId).eq("teamId", teamId)
      )
      .order("desc")
      .collect();
  },
});

// Create card for team
export const createTeamCard = mutation({
  args: {
    deckId: v.id("decks"),
    front: v.string(),
    back: v.string(),
    tags: v.optional(v.array(v.string())),
    teamId: v.string(),
    ownerId: v.string(),
  },
  handler: async (ctx, { deckId, front, back, tags = [], teamId, ownerId }) => {
    // Verify deck belongs to team
    const deck = await ctx.db.get(deckId);
    if (!deck || deck.teamId !== teamId) {
      throw new Error("Deck not found or not in team");
    }
    
    const now = Date.now();
    return await ctx.db.insert("cards", {
      deckId,
      front,
      back,
      tags,
      teamId,
      ownerId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update team card
export const updateTeamCard = mutation({
  args: {
    cardId: v.id("cards"),
    front: v.optional(v.string()),
    back: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    teamId: v.string(),
  },
  handler: async (ctx, { cardId, front, back, tags, teamId }) => {
    const card = await ctx.db.get(cardId);
    if (!card || card.teamId !== teamId) {
      throw new Error("Card not found or not in team");
    }
    
    const now = Date.now();
    await ctx.db.patch(cardId, {
      ...(front !== undefined && { front }),
      ...(back !== undefined && { back }),
      ...(tags !== undefined && { tags }),
      updatedAt: now,
    });
  },
});

// Delete team card
export const deleteTeamCard = mutation({
  args: { cardId: v.id("cards"), teamId: v.string() },
  handler: async (ctx, { cardId, teamId }) => {
    const card = await ctx.db.get(cardId);
    if (!card || card.teamId !== teamId) {
      throw new Error("Card not found or not in team");
    }
    
    await ctx.db.delete(cardId);
  },
});

// Get card counts for team decks
export const getTeamCardCounts = query({
  args: { teamId: v.string() },
  handler: async (ctx, { teamId }) => {
    const cards = await ctx.db
      .query("cards")
      .withIndex("by_team", (q) => q.eq("teamId", teamId))
      .collect();
    
    // Group cards by deckId and count them
    const counts: Record<string, number> = {};
    for (const card of cards) {
      const deckId = card.deckId;
      counts[deckId] = (counts[deckId] || 0) + 1;
    }
    
    return counts;
  },
});

// Search cards in a team deck
export const searchTeamCards = query({
  args: {
    deckId: v.id("decks"),
    teamId: v.string(),
    query: v.string(),
  },
  handler: async (ctx, { deckId, teamId, query }) => {
    const cards = await ctx.db
      .query("cards")
      .withIndex("by_deck_team", (q) => 
        q.eq("deckId", deckId).eq("teamId", teamId)
      )
      .collect();
    
    const lowercaseQuery = query.toLowerCase();
    
    return cards.filter(card => 
      card.front.toLowerCase().includes(lowercaseQuery) ||
      card.back.toLowerCase().includes(lowercaseQuery) ||
      card.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  },
});
