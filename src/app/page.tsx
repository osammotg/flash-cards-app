'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { DeckCard } from '@/components/DeckCard';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDecks } from '@/hooks/use-decks';
import { useCards } from '@/hooks/use-cards';
import { useDeckCardCounts } from '@/hooks/use-deck-card-counts';
import { useToast } from '@/hooks/use-toast';
import { Plus, BookOpen } from 'lucide-react';
import { Deck } from '@/lib/types';
import { FullScreenLoader } from '@/components/Loader';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const router = useRouter();
  const { decks, loading, createDeck, updateDeck, removeDeck } = useDecks();
  const { cardCounts, loading: countsLoading } = useDeckCardCounts();
  const { toast } = useToast();

  // Get card counts for each deck
  const deckWithCounts = decks.map(deck => ({
    ...deck,
    cardCount: cardCounts[deck._id] || 0,
  }));

  const filteredDecks = deckWithCounts.filter(deck =>
    deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDeck = async () => {
    if (!newDeckTitle.trim()) return;

    try {
      await createDeck({
        title: newDeckTitle.trim(),
        description: newDeckDescription.trim() || undefined,
      });
      setNewDeckTitle('');
      setNewDeckDescription('');
      setIsCreateDialogOpen(false);
      toast({
        title: 'Deck created',
        description: 'Your new deck has been created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create deck. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditDeck = async () => {
    if (!editingDeck || !editTitle.trim()) return;

    try {
      await updateDeck(editingDeck._id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setEditingDeck(null);
      setEditTitle('');
      setEditDescription('');
      toast({
        title: 'Deck updated',
        description: 'Your deck has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update deck. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDeck = async (deck: Deck) => {
    if (!confirm(`Are you sure you want to delete "${deck.title}"? This will also delete all cards in this deck.`)) {
      return;
    }

    try {
      await removeDeck(deck._id);
      toast({
        title: 'Deck deleted',
        description: 'Your deck has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete deck. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (deck: Deck) => {
    setEditingDeck(deck);
    setEditTitle(deck.title);
    setEditDescription(deck.description || '');
  };

  // Show full screen loader when data is loading
  if (loading || countsLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mobile-content container mx-auto px-4 py-6 pb-20 sm:pb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Decks</h1>
              <p className="text-muted-foreground">
                Create and manage your flashcard decks
              </p>
            </div>
            {decks.length === 0 && (
              <Button
                variant="outline"
                onClick={() => router.push('/seed')}
                className="hidden sm:flex"
              >
                Add Demo Data
              </Button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <SearchBar
            placeholder="Search decks..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDecks.length === 0 ? (
          <EmptyState
            icon="📚"
            title={searchQuery ? 'No decks found' : 'No decks yet'}
            description={
              searchQuery
                ? 'Try adjusting your search terms'
                : 'Create your first deck to get started with studying'
            }
            action={
              !searchQuery
                ? {
                    label: 'Create Deck',
                    onClick: () => setIsCreateDialogOpen(true),
                  }
                : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDecks.map((deck) => (
              <DeckCard
                key={deck._id}
                deck={deck}
                cardCount={deck.cardCount}
                onEdit={openEditDialog}
                onDelete={handleDeleteDeck}
              />
            ))}
          </div>
        )}

        {/* Create Deck Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 rounded-full h-14 w-14 shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Deck</DialogTitle>
              <DialogDescription>
                Create a new flashcard deck to start studying.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Enter deck title"
                  value={newDeckTitle}
                  onChange={(e) => setNewDeckTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description (optional)</label>
                <Textarea
                  placeholder="Enter deck description"
                  value={newDeckDescription}
                  onChange={(e) => setNewDeckDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateDeck} disabled={!newDeckTitle.trim()}>
                Create Deck
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Deck Dialog */}
        <Dialog open={!!editingDeck} onOpenChange={() => setEditingDeck(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Deck</DialogTitle>
              <DialogDescription>
                Update your deck information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Enter deck title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description (optional)</label>
                <Textarea
                  placeholder="Enter deck description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingDeck(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditDeck} disabled={!editTitle.trim()}>
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
