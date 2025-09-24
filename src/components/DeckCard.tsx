'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Edit, Trash2, Lock } from 'lucide-react';
import { Deck } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface DeckCardProps {
  deck: Deck;
  cardCount: number;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deck: Deck) => void;
  isTeamDeck?: boolean;
  teamId?: string;
  isPreview?: boolean;
}

export function DeckCard({ deck, cardCount, onEdit, onDelete, isTeamDeck = false, teamId, isPreview = false }: DeckCardProps) {
  return (
    <Card className={`group hover:shadow-md transition-shadow ${isPreview ? 'opacity-75 bg-white/80 backdrop-blur-sm border-slate-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className={`text-lg line-clamp-2 ${isPreview ? 'text-slate-600' : ''}`}>{deck.title}</CardTitle>
            {deck.description && (
              <CardDescription className={`line-clamp-2 ${isPreview ? 'text-slate-500' : ''}`}>
                {deck.description}
              </CardDescription>
            )}
          </div>
          <div className="flex space-x-1">
            {isPreview && (
              <div className="p-1 bg-slate-100 rounded">
                <Lock className="h-4 w-4 text-slate-500" />
              </div>
            )}
            {!isPreview && (
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(deck)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(deck)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className={`flex items-center space-x-4 text-sm ${isPreview ? 'text-slate-500' : 'text-muted-foreground'}`}>
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>{cardCount} cards</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDistanceToNow(new Date(deck.updatedAt), { addSuffix: true })}</span>
          </div>
        </div>
        {isPreview && (
          <div className="mt-2">
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
              Preview Only
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        {isPreview ? (
          <Button disabled className="w-full bg-slate-300 text-slate-500 cursor-not-allowed">
            <Lock className="mr-2 h-4 w-4" />
            Join Team to Access
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link href={isTeamDeck && teamId ? `/team/${teamId}/deck/${deck._id}` : `/deck/${deck._id}`}>
              <BookOpen className="mr-2 h-4 w-4" />
              View Cards
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
