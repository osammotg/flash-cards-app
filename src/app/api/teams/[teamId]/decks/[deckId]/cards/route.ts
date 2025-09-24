import { stackServerApp } from '@/stack/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
  request: Request,
  { params }: { params: { teamId: string; deckId: string } }
) {
  try {
    const { teamId, deckId } = params;
    
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

    // Get team cards from Convex
    const teamCards = await convex.query(api.teamDecks.getTeamCards, { 
      deckId: deckId as any, 
      teamId 
    });

    return Response.json({ cards: teamCards });
  } catch (error) {
    console.error('Failed to get team cards:', error);
    return Response.json({ 
      error: 'Failed to get team cards' 
    }, { status: 500 });
  }
}
