import { stackServerApp } from '@/stack/server';

export async function verifyTeamMembership(userId: string, teamId: string): Promise<boolean> {
  try {
    const user = await stackServerApp.getUser({ userId });
    if (!user) {
      return false;
    }

    const team = await user.getTeam(teamId);
    return team !== null;
  } catch (error) {
    console.error('Error verifying team membership:', error);
    return false;
  }
}

export async function getAuthenticatedUser() {
  try {
    const user = await stackServerApp.getUser();
    return user;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}
