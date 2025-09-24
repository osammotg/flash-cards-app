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
import { Plus, BookOpen, Flower } from 'lucide-react';
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
          // Modern minimalistic welcome screen
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="max-w-md mx-auto text-center space-y-8">
              {/* Blossom Logo */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Flower className="h-10 w-10 text-white" />
                </div>
              </div>
              
              {/* Welcome Text */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Welcome to Blossom
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  Start learning faster using our smart flashcards
                </p>
              </div>
              
              {/* Modern Sign In Component */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Sign in to start
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Access your personalized learning experience
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => window.location.href = '/handler/sign-in'}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Sign In
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Don't have an account?{' '}
                      <button 
                        onClick={() => window.location.href = '/handler/sign-up'}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Create one
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Show deck management when user is authenticated
          <>
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
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
