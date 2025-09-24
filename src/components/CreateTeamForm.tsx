'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';

export function CreateTeamForm({ variant = "default" }: { variant?: "default" | "team" }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateTeam = async () => {
    if (!name.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/teams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(), 
          description: description.trim() || undefined 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Team Created!',
          description: `Successfully created team "${data.team.name}"`,
        });
        
        // Reset form and close dialog
        setName('');
        setDescription('');
        setIsOpen(false);
        
        // Redirect to team page
        window.location.href = `/team/${data.team.id}`;
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create team',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to create team:', error);
      toast({
        title: 'Error',
        description: 'Failed to create team. Please try again.',
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
          {variant === "team" ? "Create Deck" : "Create New Team"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">Create a New Team</DialogTitle>
          <p className="text-muted-foreground">Start collaborating with your team on flashcards</p>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Team Name *</label>
            <Input
              placeholder="Enter team name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description (optional)</label>
            <Textarea
              placeholder="Describe your team's purpose and goals"
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
            onClick={handleCreateTeam} 
            disabled={!name.trim() || isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              'Create Team'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
