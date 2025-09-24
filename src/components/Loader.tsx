'use client';

import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Loader({ size = 'md', className = '' }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Rotating gradient ring */}
        <div className="absolute inset-0 rounded-full">
          <div className="w-full h-full rounded-full border-4 border-transparent loader-gradient" />
        </div>
        
        {/* Inner circle with subtle gradient */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-50 to-violet-50 animate-pulse" />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 loader-pulse" />
        </div>
      </div>
    </div>
  );
}

// Full screen loader for initial page loads
export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader size="xl" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">Loading...</h3>
          <p className="text-sm text-muted-foreground">Fetching your data</p>
        </div>
      </div>
    </div>
  );
}

// Inline loader for smaller loading states
export function InlineLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center space-x-3 py-4">
      <Loader size="sm" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}
