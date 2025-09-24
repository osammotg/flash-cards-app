'use client';

import { useState } from 'react';

export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { seedDemoData } from '@/lib/seed';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Database, CheckCircle } from 'lucide-react';

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDemoData();
      setIsSeeded(true);
      toast({
        title: 'Demo data created!',
        description: 'You can now explore the app with sample content.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create demo data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Seed Demo Data</h1>
              <p className="text-muted-foreground">Add sample content to get started</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Demo Content</span>
              </CardTitle>
              <CardDescription>
                This will create a sample deck with enzyme-related flashcards to help you explore the app.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">What will be created:</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 1 demo deck: &quot;Enzymes — Quick Start&quot;</li>
                  <li>• 15 sample flashcards covering enzyme basics</li>
                  <li>• Tags and categories for organization</li>
                  <li>• Ready-to-use study content</li>
                </ul>
              </div>

              {isSeeded ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Demo data has been created successfully!</span>
                </div>
              ) : (
                <Button 
                  onClick={handleSeed} 
                  disabled={isSeeding}
                  className="w-full"
                >
                  {isSeeding ? 'Creating demo data...' : 'Create Demo Data'}
                </Button>
              )}

              {isSeeded && (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/')}
                    className="flex-1"
                  >
                    Go to Home
                  </Button>
                  <Button 
                    onClick={() => router.push('/study')}
                    className="flex-1"
                  >
                    Start Studying
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
