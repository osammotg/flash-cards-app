'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, FullScreenLoader, InlineLoader } from '@/components/Loader';

export default function LoaderTestPage() {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showInline, setShowInline] = useState(false);

  if (showFullScreen) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Loader Test Page</h1>
          <p className="text-muted-foreground">
            Test different loader components and animations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Different sizes */}
          <Card>
            <CardHeader>
              <CardTitle>Loader Sizes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Loader size="sm" />
                <span className="text-sm">Small</span>
              </div>
              <div className="flex items-center space-x-4">
                <Loader size="md" />
                <span className="text-sm">Medium</span>
              </div>
              <div className="flex items-center space-x-4">
                <Loader size="lg" />
                <span className="text-sm">Large</span>
              </div>
              <div className="flex items-center space-x-4">
                <Loader size="xl" />
                <span className="text-sm">Extra Large</span>
              </div>
            </CardContent>
          </Card>

          {/* Inline loader */}
          <Card>
            <CardHeader>
              <CardTitle>Inline Loader</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowInline(!showInline)}
                className="mb-4"
              >
                Toggle Inline Loader
              </Button>
              {showInline && <InlineLoader text="Loading data..." />}
            </CardContent>
          </Card>

          {/* Full screen loader */}
          <Card>
            <CardHeader>
              <CardTitle>Full Screen Loader</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowFullScreen(true)}
                className="w-full"
              >
                Show Full Screen Loader
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                This will show the full screen loader for 3 seconds
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Animation details */}
        <Card>
          <CardHeader>
            <CardTitle>Animation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Gradient Colors:</strong> Blue → Violet → Rose → Light Green → Blue</p>
              <p><strong>Rotation Speed:</strong> 2 seconds per full rotation</p>
              <p><strong>Pulse Effect:</strong> Center dot pulses with glow effect</p>
              <p><strong>CSS Classes:</strong> Uses custom CSS animations for better performance</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
