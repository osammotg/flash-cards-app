import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all public teams
export const getPublicTeams = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("publicTeams")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("desc")
      .collect();
  },
});

// Get a specific public team
export const getPublicTeam = query({
  args: { teamId: v.string() },
  handler: async (ctx, { teamId }) => {
    return await ctx.db
      .query("publicTeams")
      .filter((q) => q.eq(q.field("teamId"), teamId))
      .first();
  },
});

// Create public team
export const create = mutation({
  args: {
    teamId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { teamId, name, description }) => {
    const now = Date.now();
    return await ctx.db.insert("publicTeams", {
      teamId,
      name,
      description,
      memberCount: 1,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Increment member count
export const incrementMemberCount = mutation({
  args: { teamId: v.string() },
  handler: async (ctx, { teamId }) => {
    const team = await ctx.db
      .query("publicTeams")
      .filter((q) => q.eq(q.field("teamId"), teamId))
      .first();
    
    if (team) {
      await ctx.db.patch(team._id, {
        memberCount: team.memberCount + 1,
        updatedAt: Date.now(),
      });
    }
  },
});

// Decrement member count
export const decrementMemberCount = mutation({
  args: { teamId: v.string() },
  handler: async (ctx, { teamId }) => {
    const team = await ctx.db
      .query("publicTeams")
      .filter((q) => q.eq(q.field("teamId"), teamId))
      .first();
    
    if (team && team.memberCount > 0) {
      await ctx.db.patch(team._id, {
        memberCount: team.memberCount - 1,
        updatedAt: Date.now(),
      });
    }
  },
});

// Update team info
export const updateTeam = mutation({
  args: {
    teamId: v.string(),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { teamId, name, description }) => {
    const team = await ctx.db
      .query("publicTeams")
      .filter((q) => q.eq(q.field("teamId"), teamId))
      .first();
    
    if (team) {
      await ctx.db.patch(team._id, {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        updatedAt: Date.now(),
      });
    }
  },
});

// Deactivate team
export const deactivateTeam = mutation({
  args: { teamId: v.string() },
  handler: async (ctx, { teamId }) => {
    const team = await ctx.db
      .query("publicTeams")
      .filter((q) => q.eq(q.field("teamId"), teamId))
      .first();
    
    if (team) {
      await ctx.db.patch(team._id, {
        isActive: false,
        updatedAt: Date.now(),
      });
    }
  },
});
