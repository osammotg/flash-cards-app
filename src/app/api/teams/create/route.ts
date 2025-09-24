import { stackServerApp } from '@/stack/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();
    
    if (!name?.trim()) {
      return Response.json({ error: 'Team name is required' }, { status: 400 });
    }
    
    // Get current user - handle case where user might not be authenticated
    const user = await stackServerApp.getUser();
    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Create team in Stack Auth
    const team = await stackServerApp.createTeam({
      displayName: name.trim(),
    });
    
    // Add current user to team
    await team.addUser(user.id);
    
    // Register as public team in Convex
    const publicTeam = await convex.mutation(api.publicTeams.create, {
      teamId: team.id,
      name: name.trim(),
      description: description?.trim(),
    });
    
    return Response.json({ 
      success: true, 
      team: { 
        id: team.id, 
        name: team.displayName,
        description: team.description 
      },
      publicTeam 
    });
  } catch (error) {
    console.error('Failed to create team:', error);
    return Response.json({ 
      error: 'Failed to create team. Please try again.' 
    }, { status: 500 });
  }
}
