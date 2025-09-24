import { stackServerApp } from '@/stack/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const { teamId } = params;
    
    // Get current user
    const user = await stackServerApp.getUser();
    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify team membership
    const team = await user.getTeam(teamId);
    if (!team) {
      return Response.json({ error: 'You are not a member of this team' }, { status: 403 });
    }

    // Get team decks from Convex
    const teamDecks = await convex.query(api.teamDecks.getTeamDecks, { teamId });
    const teamCardCounts = await convex.query(api.teamDecks.getTeamCardCounts, { teamId });

    return Response.json({
      decks: teamDecks,
      cardCounts: teamCardCounts,
    });
  } catch (error) {
    console.error('Failed to get team decks:', error);
    return Response.json({ 
      error: 'Failed to get team decks' 
    }, { status: 500 });
  }
}
