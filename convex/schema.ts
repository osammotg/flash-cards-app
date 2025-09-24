import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  decks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    teamId: v.optional(v.string()),        // Stack Auth team ID
    ownerId: v.optional(v.string()),       // Stack Auth user ID
    isPublic: v.optional(v.boolean()),     // For public teams
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_updated_at", ["updatedAt"])
    .index("by_created_at", ["createdAt"])
    .index("by_team", ["teamId"])
    .index("by_owner", ["ownerId"])
    .index("by_team_updated", ["teamId", "updatedAt"])
    .index("by_public_teams", ["isPublic", "teamId"]),

  cards: defineTable({
    deckId: v.id("decks"),
    front: v.string(),
    back: v.string(),
    tags: v.array(v.string()),
    teamId: v.optional(v.string()),        // Inherited from deck
    ownerId: v.optional(v.string()),       // Who created the card
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_deck", ["deckId"])
    .index("by_deck_updated", ["deckId", "updatedAt"])
    .index("by_team", ["teamId"])
    .index("by_deck_team", ["deckId", "teamId"])
    .index("by_owner", ["ownerId"]),

  // New: Public teams registry
  publicTeams: defineTable({
    teamId: v.string(),                    // Stack Auth team ID
    name: v.string(),                      // Team display name
    description: v.optional(v.string()),
    memberCount: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_active", ["isActive"])
    .index("by_member_count", ["memberCount"])
    .index("by_created", ["createdAt"]),
});
