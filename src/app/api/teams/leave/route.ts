import { stackServerApp } from '@/stack/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    const { teamId } = await request.json();
    
    if (!teamId) {
      return Response.json({ error: 'Team ID is required' }, { status: 400 });
    }
    
    const user = await stackServerApp.getUser();
    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }
    const team = await stackServerApp.getTeam(teamId);
    
    if (!team) {
      return Response.json({ error: 'Team not found' }, { status: 404 });
    }
    
    // Check if user is a member
    const userTeams = await user.listTeams();
    const isMember = userTeams.some(t => t.id === teamId);
    
    if (!isMember) {
      return Response.json({ 
        success: true, 
        message: 'You are not a member of this team' 
      });
    }
    
    // Remove user from team
    await team.removeUser(user.id);
    
    // Update member count in Convex
    await convex.mutation(api.publicTeams.decrementMemberCount, { teamId });
    
    return Response.json({ 
      success: true, 
      message: 'Successfully left team'
    });
  } catch (error) {
    console.error('Failed to leave team:', error);
    return Response.json({ 
      error: 'Failed to leave team. Please try again.' 
    }, { status: 500 });
  }
}
