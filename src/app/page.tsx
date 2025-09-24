'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@stackframe/stack';

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
import { Plus, BookOpen, Flower, Users } from 'lucide-react';
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
  const user = useUser();
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
        {!user ? (
          // Minimalistic Apple-style welcome screen
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="max-w-sm mx-auto text-center space-y-12">
              {/* Minimal Logo */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
                  <Flower className="h-8 w-8 text-white" />
                </div>
              </div>
              
              {/* Minimal Text */}
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                  Blossom
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Smart flashcards
                </p>
              </div>
              
              {/* Minimal Sign In */}
              <div className="space-y-4">
                <Button 
                  onClick={() => window.location.href = '/handler/sign-in'}
                  className="w-full h-12 bg-black dark:bg-white text-white dark:text-black font-medium rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </Button>
                
                <button 
                  onClick={() => window.location.href = '/handler/sign-up'}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  Create account
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Minimalistic deck management
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Decks</h1>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/teams')}
                    className="h-10 w-10"
                  >
                    <Users className="h-5 w-5" />
                  </Button>
                  {decks.length === 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push('/seed')}
                      className="h-10 w-10 hidden sm:flex"
                    >
                      <BookOpen className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <SearchBar
                placeholder="Search"
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
                title={searchQuery ? 'No results' : 'No decks'}
                description={
                  searchQuery
                    ? 'Try different search terms'
                    : 'Create your first deck'
                }
                action={
                  !searchQuery
                    ? {
                        label: 'Create',
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
                  <DialogTitle>New Deck</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Title"
                      value={newDeckTitle}
                      onChange={(e) => setNewDeckTitle(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Description (optional)"
                      value={newDeckDescription}
                      onChange={(e) => setNewDeckDescription(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDeck} disabled={!newDeckTitle.trim()}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Deck Dialog */}
            <Dialog open={!!editingDeck} onOpenChange={() => setEditingDeck(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Deck</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Description (optional)"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setEditingDeck(null)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleEditDeck} disabled={!editTitle.trim()}>
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
