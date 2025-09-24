'use client';

import { useState } from 'react';
import { useUser } from '@stackframe/stack';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Shield, 
  Zap, 
  Star, 
  CheckCircle, 
  Crown,
  Loader2
} from 'lucide-react';

export function PremiumPlan() {
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  
  // Check if user has premium subscription
  const hasPremium = user?.clientMetadata?.subscriptionStatus === 'active';

  const handleSubscribe = async () => {
    if (!user) {
      alert('Please sign in to subscribe to premium');
      return;
    }

    setIsLoading(true);
    try {
      // Create Stripe checkout URL using Stack Auth
      const checkoutUrl = await user.createCheckoutUrl({ offerId: "offer-2" });
      
      // Open checkout in new tab
      window.open(checkoutUrl, "_blank");
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Free Plan */}
      <Card className="border-2 border-slate-200 hover:border-slate-300 transition-colors">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-slate-700">Free Plan</CardTitle>
          <CardDescription className="text-lg">Perfect for personal use</CardDescription>
          <div className="text-4xl font-bold text-slate-900 mt-4">$0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Create personal flashcard decks</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Study with spaced repetition</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Basic progress tracking</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Mobile-optimized interface</span>
            </li>
          </ul>
          <Button 
            variant="outline" 
            className="w-full mt-6"
            disabled
          >
            Current Plan
          </Button>
        </CardContent>
      </Card>

      {/* Premium Plan */}
      <Card className="border-2 border-blue-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-purple-600 text-white px-4 py-1 text-sm font-medium">
          <Crown className="h-4 w-4 inline mr-1" />
          Most Popular
        </div>
        
        <CardHeader className="text-center pb-4 pt-8">
          <CardTitle className="text-2xl font-bold text-blue-600">Premium Plan</CardTitle>
          <CardDescription className="text-lg">Unlock collaborative learning</CardDescription>
          <div className="text-4xl font-bold text-blue-600 mt-4">
            $9.99<span className="text-lg font-normal text-muted-foreground">/week</span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Everything in Free Plan</span>
            </li>
            <li className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-600" />
              <span><strong>Create and join teams</strong></span>
            </li>
            <li className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span><strong>Shared flashcard decks</strong></span>
            </li>
            <li className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <span><strong>Team collaboration features</strong></span>
            </li>
            <li className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-blue-600" />
              <span><strong>Advanced study analytics</strong></span>
            </li>
            <li className="flex items-center gap-3">
              <Star className="h-5 w-5 text-blue-600" />
              <span><strong>Priority support</strong></span>
            </li>
          </ul>
          
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg mt-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Perfect for:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Study groups and classrooms</li>
              <li>• Team training and onboarding</li>
              <li>• Collaborative knowledge sharing</li>
              <li>• Educational institutions</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleSubscribe}
            disabled={isLoading || hasPremium}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : hasPremium ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Premium Active
              </>
            ) : (
              <>
                <Crown className="h-4 w-4 mr-2" />
                Subscribe to Premium
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-2">
            Cancel anytime • 30-day money-back guarantee
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
