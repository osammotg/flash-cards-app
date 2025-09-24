'use client';

import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function PublicTeamsBrowser() {
  const publicTeams = useQuery(api.publicTeams.getPublicTeams);
  const [joiningTeam, setJoiningTeam] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleJoinTeam = async (teamId: string) => {
    setJoiningTeam(teamId);
    try {
      const response = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Success!',
          description: data.message || 'Successfully joined team',
        });
        // Redirect to team page
        window.location.href = `/team/${teamId}`;
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to join team',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to join team:', error);
      toast({
        title: 'Error',
        description: 'Failed to join team. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setJoiningTeam(null);
    }
  };

  if (publicTeams === undefined) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (publicTeams.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No teams available</h3>
        <p className="text-muted-foreground">
          Be the first to create a team and start collaborating!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {publicTeams.map((team) => (
        <Card key={team.teamId} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {team.name}
            </CardTitle>
            <CardDescription>{team.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {team.memberCount} member{team.memberCount !== 1 ? 's' : ''}
              </div>
              <Button 
                onClick={() => handleJoinTeam(team.teamId)}
                size="sm"
                disabled={joiningTeam === team.teamId}
              >
                {joiningTeam === team.teamId ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Joining...
                  </>
                ) : (
                  'Join Team'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
