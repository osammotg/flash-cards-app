'use client';

import { useUser } from '@stackframe/stack';
import { useState, useEffect } from 'react';
import { DeckCard } from '@/components/DeckCard';
import { CreateTeamDeckForm } from '@/components/CreateTeamDeckForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Loader2, LogOut, Plus, TrendingUp, Clock, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function TeamDeckManager({ teamId }: { teamId: string }) {
  const user = useUser({ or: 'redirect' });
  const team = user.useTeam(teamId);
  const [teamDecks, setTeamDecks] = useState<any[]>([]);
  const [teamCardCounts, setTeamCardCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [leavingTeam, setLeavingTeam] = useState(false);
  const { toast } = useToast();

  // Fetch team data securely
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/teams/${teamId}/decks`);
        
        if (response.status === 403) {
          // User is not a team member - redirect to preview
          window.location.reload();
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch team data');
        }
        
        const data = await response.json();
        setTeamDecks(data.decks || []);
        setTeamCardCounts(data.cardCounts || {});
      } catch (error) {
        console.error('Failed to fetch team data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load team data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId, toast]);

  const handleLeaveTeam = async () => {
    if (!confirm('Are you sure you want to leave this team? You will lose access to all team decks and cards.')) {
      return;
    }

    setLeavingTeam(true);
    try {
      const response = await fetch('/api/teams/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Left Team',
          description: data.message || 'Successfully left team',
        });
        // Redirect to teams page
        window.location.href = '/teams';
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to leave team',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to leave team:', error);
      toast({
        title: 'Error',
        description: 'Failed to leave team. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLeavingTeam(false);
    }
  };

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Team Not Found</h1>
          <p className="text-muted-foreground mb-4">
            You are not a member of this team or the team doesn't exist.
          </p>
          <Button onClick={() => window.location.href = '/teams'}>
            Browse Teams
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{team.displayName}</h1>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      <Users className="h-3 w-3 mr-1" />
                      {team.members?.length || 'Unknown'} members
                    </Badge>
                  </div>
                </div>
                <p className="text-xl text-blue-100 max-w-2xl">
                  Collaborate on flashcards with your team. Share knowledge, study together, and achieve your learning goals.
                </p>
              </div>
                  <div className="hidden lg:flex items-center gap-3">
                    <CreateTeamDeckForm teamId={teamId} />
                    <Button
                  variant="outline"
                  onClick={handleLeaveTeam}
                  disabled={leavingTeam}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  {leavingTeam ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Leaving...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      Leave Team
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Decks</p>
                  <p className="text-3xl font-bold text-blue-600">{teamDecks.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Cards</p>
                  <p className="text-3xl font-bold text-green-600">
                    {Object.values(teamCardCounts || {}).reduce((sum, count) => sum + count, 0)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {team.members?.length || 'Unknown'}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Decks Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Team Decks</h2>
              <p className="text-muted-foreground">Collaborative flashcard decks for your team</p>
            </div>
                <div className="flex items-center gap-3">
                  <CreateTeamDeckForm teamId={teamId} />
                  <Button
                variant="outline"
                onClick={handleLeaveTeam}
                disabled={leavingTeam}
                className="lg:hidden"
                size="sm"
              >
                {leavingTeam ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Leaving...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Leave
                  </>
                )}
              </Button>
            </div>
          </div>

          {teamDecks.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  No decks yet
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Start collaborating by creating the first deck for your team! Share knowledge and study together.
                </p>
                <CreateTeamDeckForm teamId={teamId} />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamDecks.map((deck) => (
                <div key={deck._id} className="transform transition-all duration-200 hover:scale-105">
                  <DeckCard
                    deck={deck}
                    cardCount={teamCardCounts?.[deck._id] || 0}
                    isTeamDeck={true}
                    teamId={teamId}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
