'use client';

import { useUser } from '@stackframe/stack';
import { TeamDeckManager } from '@/components/TeamDeckManager';
import { TeamPreviewManager } from '@/components/TeamPreviewManager';
import { Header } from '@/components/Header';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function TeamPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const user = useUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground">
              Please sign in to access team features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is a member of this team
  const team = user.useTeam(teamId);
  const isTeamMember = team !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />
      {isTeamMember ? (
        <TeamDeckManager teamId={teamId} />
      ) : (
        <TeamPreviewManager teamId={teamId} />
      )}
    </div>
  );
}
