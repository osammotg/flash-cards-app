'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useUser } from '@stackframe/stack';

export function CreateTeamDeckForm({ teamId }: { teamId: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const user = useUser({ or: 'redirect' });
  const createTeamDeck = useMutation(api.teamDecks.createTeamDeck);

  const handleCreateDeck = async () => {
    if (!title.trim()) return;
    
    setIsLoading(true);
    try {
      await createTeamDeck({
        title: title.trim(),
        description: description.trim() || undefined,
        teamId,
        ownerId: user.id,
      });
      
      toast({
        title: 'Deck Created!',
        description: `Successfully created deck "${title.trim()}"`,
      });
      
      // Reset form and close dialog
      setTitle('');
      setDescription('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create deck:', error);
      toast({
        title: 'Error',
        description: 'Failed to create deck. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Create Deck
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">Create a New Deck</DialogTitle>
          <p className="text-muted-foreground">Add a new flashcard deck for your team</p>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Deck Title *</label>
            <Input
              placeholder="Enter deck title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description (optional)</label>
            <Textarea
              placeholder="Describe what this deck covers"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateDeck} 
            disabled={!title.trim() || isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              'Create Deck'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
