'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useDecks } from '@/hooks/use-decks';
import { useCards } from '@/hooks/use-cards';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, Search, Tag } from 'lucide-react';
import { Card as CardType } from '@/lib/types';
import { FullScreenLoader, InlineLoader } from '@/components/Loader';

export default function DeckPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [newCardTags, setNewCardTags] = useState('');
  const [editCardFront, setEditCardFront] = useState('');
  const [editCardBack, setEditCardBack] = useState('');
  const [editCardTags, setEditCardTags] = useState('');

  const { decks, loading: decksLoading, updateDeck, removeDeck } = useDecks();
  const { cards, loading, createCard, updateCard, removeCard, searchCards } = useCards(deckId);
  const { toast } = useToast();

  const deck = decks.find(d => d._id === deckId);
  const [filteredCards, setFilteredCards] = useState<CardType[]>([]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchCards(searchQuery).then(setFilteredCards);
    } else {
      setFilteredCards(cards || []);
    }
  }, [searchQuery, cards]);

  // Show full screen loader when data is loading
  if (loading || decksLoading) {
    return <FullScreenLoader />;
  }

  if (!deck) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mobile-content container mx-auto px-4 py-6 pb-20 sm:pb-6">
          <EmptyState
            icon="❌"
            title="Deck not found"
            description="The deck you're looking for doesn't exist."
            action={{
              label: 'Go Home',
              onClick: () => router.push('/'),
            }}
          />
        </main>
        <BottomNav />
      </div>
    );
  }

  const handleCreateCard = async () => {
    if (!newCardFront.trim() || !newCardBack.trim()) return;

    try {
      const tags = newCardTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await createCard({
        front: newCardFront.trim(),
        back: newCardBack.trim(),
        tags,
      });

      setNewCardFront('');
      setNewCardBack('');
      setNewCardTags('');
      setIsCreateDialogOpen(false);

      toast({
        title: 'Card created',
        description: 'Your new card has been created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create card. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditCard = async () => {
    if (!editingCard || !editCardFront.trim() || !editCardBack.trim()) return;

    try {
      const tags = editCardTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await updateCard(editingCard._id, {
        front: editCardFront.trim(),
        back: editCardBack.trim(),
        tags,
      });

      setEditingCard(null);
      setEditCardFront('');
      setEditCardBack('');
      setEditCardTags('');
      setIsEditDialogOpen(false);

      toast({
        title: 'Card updated',
        description: 'Your card has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update card. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCard = async (card: CardType) => {
    if (!confirm(`Are you sure you want to delete this card?`)) {
      return;
    }

    try {
      await removeCard(card._id);
      toast({
        title: 'Card deleted',
        description: 'Your card has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete card. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDeck = async () => {
    if (!confirm(`Are you sure you want to delete "${deck.title}"? This will also delete all cards in this deck.`)) {
      return;
    }

    try {
      await removeDeck(deck._id);
      toast({
        title: 'Deck deleted',
        description: 'Your deck has been deleted successfully.',
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete deck. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openEditCard = (card: CardType) => {
    setEditingCard(card);
    setEditCardFront(card.front);
    setEditCardBack(card.back);
    setEditCardTags(card.tags.join(', '));
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mobile-content container mx-auto px-4 py-6 pb-20 sm:pb-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{deck.title}</h1>
              {deck.description && (
                <p className="text-muted-foreground">{deck.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/study/${deck._id}`)}
              >
                <BookOpen className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDeleteDeck}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {cards.length} cards
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Card
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar
            placeholder="Search cards..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        {/* Cards List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredCards.length === 0 ? (
          <EmptyState
            icon="📝"
            title={searchQuery ? 'No cards found' : 'No cards yet'}
            description={
              searchQuery
                ? 'Try adjusting your search terms'
                : 'Add your first card to start studying'
            }
            action={
              !searchQuery
                ? {
                    label: 'Add Card',
                    onClick: () => setIsCreateDialogOpen(true),
                  }
                : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredCards.map((card) => (
              <Card key={card._id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Question</div>
                        <div className="text-sm line-clamp-2">{card.front}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Answer</div>
                        <div className="text-sm line-clamp-2">{card.back}</div>
                      </div>
                      {card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {card.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Tag className="mr-1 h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditCard(card)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCard(card)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Create Card Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Card</DialogTitle>
              <DialogDescription>
                Create a new flashcard for this deck.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Question</label>
                <Textarea
                  placeholder="Enter the question or prompt"
                  value={newCardFront}
                  onChange={(e) => setNewCardFront(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Answer</label>
                <Textarea
                  placeholder="Enter the answer"
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tags (optional)</label>
                <Input
                  placeholder="Enter tags separated by commas"
                  value={newCardTags}
                  onChange={(e) => setNewCardTags(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Example: biology, chapter-1, important
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCard} 
                disabled={!newCardFront.trim() || !newCardBack.trim()}
              >
                Create Card
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Card Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Card</DialogTitle>
              <DialogDescription>
                Update your flashcard information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Question</label>
                <Textarea
                  placeholder="Enter the question or prompt"
                  value={editCardFront}
                  onChange={(e) => setEditCardFront(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Answer</label>
                <Textarea
                  placeholder="Enter the answer"
                  value={editCardBack}
                  onChange={(e) => setEditCardBack(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tags (optional)</label>
                <Input
                  placeholder="Enter tags separated by commas"
                  value={editCardTags}
                  onChange={(e) => setEditCardTags(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Example: biology, chapter-1, important
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditCard} 
                disabled={!editCardFront.trim() || !editCardBack.trim()}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <BottomNav />
    </div>
  );
}

export const dynamic = 'force-dynamic';
