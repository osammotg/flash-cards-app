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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Users className="h-8 w-8" />
                Public Teams
              </h1>
              <p className="text-muted-foreground">
                Join existing teams or create your own to collaborate on flashcards
              </p>
            </div>
          </div>
          {user && <CreateTeamForm />}
        </div>

        {/* Welcome Card for Non-Authenticated Users */}
        {!user && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Join the Community
              </CardTitle>
              <CardDescription>
                Sign in to join teams and start collaborating on flashcards with others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/handler/sign-in">Sign In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/handler/sign-up">Sign Up</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Teams Browser */}
        <PublicTeamsBrowser />
      </div>
    </div>
  );
}
