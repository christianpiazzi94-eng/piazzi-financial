// app/pricing/page.tsx
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react'; // Import useState for loading state

// --- Use the Price IDs directly from environment if needed, or keep defined here ---
// Ensure these match the keys used in PRICE_ID_TO_ROLE_MAP in the API route
const STRIPE_PRICE_IDS = {
  SCREENER: process.env.NEXT_PUBLIC_PRICE_SCREENER_ID || 'price_1SNIb3K5buyKUL7Sy4UX91NF', // Fallback needed if env var not set client-side
  DEEP_DIVE: process.env.NEXT_PUBLIC_PRICE_DEEPDIVE_ID || 'price_1SNIbRK5buyKUL7SdvsisPRv',
  BUNDLE: process.env.NEXT_PUBLIC_PRICE_BUNDLE_ID || 'price_1SNIbjK5buyKUL7SBbVhwhAp',
};
// ------------------------------------------------------------------------------------

const pricingTiers = [
   {
    name: 'Screener Access',
    price: '$50/year',
    // Note: 'role' is not needed here anymore, API derives it from priceId
    features: ['Exclusive Stock Lists', 'Access to Screener Page', 'Blurred Deep Dive Names'],
    priceId: STRIPE_PRICE_IDS.SCREENER,
  },
  {
    name: 'Deep Dive Access',
    price: '$50/year',
    features: ['Unlimited Research Reports', 'Full Company Analysis', 'PDF Downloads'],
    priceId: STRIPE_PRICE_IDS.DEEP_DIVE,
  },
  {
    name: 'The Bundle',
    price: '$90/year',
    features: ['Everything in Screener & Deep Dive', 'Highest Value', 'Premium Support'],
    priceId: STRIPE_PRICE_IDS.BUNDLE,
  },
];

export default function PricingPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null); // Track loading state per button

  // --- IMPROVED CHECKOUT HANDLER (using POST and error display) ---
  const handleCheckout = async (priceId: string) => {
    if (!isSignedIn) {
      alert("Please log in to purchase a subscription.");
      // Consider redirecting: window.location.assign("/sign-in");
      return;
    }
    if (!priceId || !priceId.startsWith('price_')) {
        alert("Invalid Price ID configured for this plan.");
        return;
    }

    setLoadingPriceId(priceId); // Set loading state for this specific button

    try {
      const response = await fetch('/api/checkout', { // Calls the POST endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }), // Send priceId in the body
      });

      if (!response.ok) {
        // If API returns an error (4xx, 5xx), display it
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const { url } = await response.json();
      if (url) {
        window.location.assign(url); // Redirect to Stripe
      } else {
          throw new Error("Received an invalid response from the server.");
      }

    } catch (error: any) {
      console.error("Checkout initiation failed:", error);
      // Display a user-friendly error message
      alert(`Could not start checkout: ${error.message}`);
      setLoadingPriceId(null); // Reset loading state on error
    }
    // No finally block needed, as redirection stops execution
  };
  // ------------------------------------------------------------------

  if (!isLoaded) {
    return <div className="p-20 text-center">Loading plans...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand-dark">Subscription Plans</h1>
        <p className="mt-4 text-lg text-gray-600">
          Unlock exclusive stock lists and in-depth financial research.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {pricingTiers.map((tier) => (
          <Card key={tier.name} className="flex flex-col justify-between shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold text-brand-dark">{tier.name}</CardTitle>
              <p className="text-4xl font-bold text-[#3B3B98] mt-2">{tier.price}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-700">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleCheckout(tier.priceId)}
                className="w-full bg-brand-dark text-white hover:bg-brand-dark/90"
                disabled={!isLoaded || loadingPriceId === tier.priceId} // Disable button while loading this specific price
              >
                {loadingPriceId === tier.priceId
                  ? 'Redirecting...' // Show loading text
                  : isSignedIn
                  ? 'Subscribe Now (Test: $0.00)'
                  : 'Log In to Subscribe'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}