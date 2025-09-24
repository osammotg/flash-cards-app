'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Edit, Trash2 } from 'lucide-react';
import { Deck } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface DeckCardProps {
  deck: Deck;
  cardCount: number;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deck: Deck) => void;
}

export function DeckCard({ deck, cardCount, onEdit, onDelete }: DeckCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg line-clamp-2">{deck.title}</CardTitle>
            {deck.description && (
              <CardDescription className="line-clamp-2">
                {deck.description}
              </CardDescription>
            )}
          </div>
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
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>{cardCount} cards</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDistanceToNow(new Date(deck.updatedAt), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/deck/${deck._id}`}>
            <BookOpen className="mr-2 h-4 w-4" />
            View Cards
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
