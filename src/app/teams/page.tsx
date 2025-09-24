'use client';

import { PublicTeamsBrowser } from '@/components/PublicTeamsBrowser';
import { CreateTeamForm } from '@/components/CreateTeamForm';
import { useUser } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PublicTeamsPage() {
  const user = useUser();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <Users className="h-6 w-6" />
                Teams
              </h1>
            </div>
          </div>
          {user && <CreateTeamForm />}
        </div>

        {/* Welcome Card for Non-Authenticated Users */}
        {!user && (
          <div className="mb-8 text-center">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Join Teams</h2>
              <p className="text-muted-foreground">Sign in to collaborate</p>
              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <Link href="/handler/sign-in">Sign In</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/handler/sign-up">Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Teams Browser */}
        <PublicTeamsBrowser />
      </div>
    </div>
  );
}
