'use client';

import { useUser } from '@stackframe/stack';
import { useState, useEffect } from 'react';
import { DeckCard } from '@/components/DeckCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Lock, TrendingUp, Clock, Star, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function TeamPreviewManager({ teamId }: { teamId: string }) {
  const user = useUser({ or: 'redirect' });
  const [teamDecks, setTeamDecks] = useState<any[]>([]);
  const [teamCardCounts, setTeamCardCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [joiningTeam, setJoiningTeam] = useState(false);
  const { toast } = useToast();

  // Fetch team data for preview (this will fail for non-members, which is expected)
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/teams/${teamId}/decks`);
        
        if (response.status === 403) {
          // User is not a team member - this is expected for preview mode
          // We'll show a limited preview
          setTeamDecks([]);
          setTeamCardCounts({});
          return;
        }
        
        if (response.ok) {
          const data = await response.json();
          setTeamDecks(data.decks || []);
          setTeamCardCounts(data.cardCounts || {});
        }
      } catch (error) {
        console.error('Failed to fetch team data for preview:', error);
        // For preview mode, we'll show empty state
        setTeamDecks([]);
        setTeamCardCounts({});
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  const handleJoinTeam = async () => {
    setJoiningTeam(true);
    try {
      const response = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Joined Team!',
          description: data.message || 'Successfully joined team',
        });
        // Refresh the page to show full access
        window.location.reload();
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
      setJoiningTeam(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading team content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Preview Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 p-8 text-white mb-8">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Lock className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Team Preview</h1>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      <Users className="h-3 w-3 mr-1" />
                      Join to see member count
                    </Badge>
                  </div>
                </div>
                <p className="text-xl text-slate-200 max-w-2xl">
                  This team has collaborative flashcard decks. Join the team to access all content and start studying together!
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-3">
                <Button
                  onClick={handleJoinTeam}
                  disabled={joiningTeam}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  {joiningTeam ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Joining...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Team
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm opacity-75">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Decks</p>
                  <p className="text-3xl font-bold text-slate-500">{teamDecks.length}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-xl">
                  <BookOpen className="h-6 w-6 text-slate-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm opacity-75">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Cards</p>
                  <p className="text-3xl font-bold text-slate-500">
                    {Object.values(teamCardCounts || {}).reduce((sum, count) => sum + count, 0)}
                  </p>
                </div>
                <div className="p-3 bg-slate-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-slate-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm opacity-75">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                  <p className="text-3xl font-bold text-slate-500">?</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-xl">
                  <Users className="h-6 w-6 text-slate-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Decks Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Team Decks (Preview)</h2>
              <p className="text-muted-foreground">Join the team to access these collaborative flashcard decks</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleJoinTeam}
                disabled={joiningTeam}
                className="lg:hidden"
                size="sm"
              >
                {joiningTeam ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Joining...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join Team
                  </>
                )}
              </Button>
            </div>
          </div>

          {teamDecks.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm opacity-75">
              <CardContent className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-4">
                  No decks yet
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  This team doesn't have any decks yet. Join to be the first to create one!
                </p>
                <Button
                  onClick={handleJoinTeam}
                  disabled={joiningTeam}
                  className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white border-0"
                >
                  {joiningTeam ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Joining...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Team
                    </>
                  )}
                </Button>
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
                    isPreview={true}
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
