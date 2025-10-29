// app/pricing/page.tsx
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';

// --- Price IDs (Ensure these match your .env.local and Vercel) ---
const STRIPE_PRICE_IDS = {
  SCREENER: process.env.NEXT_PUBLIC_PRICE_SCREENER_ID || 'price_1SNIb3K5buyKUL7Sy4UX91NF',
  DEEP_DIVE: process.env.NEXT_PUBLIC_PRICE_DEEPDIVE_ID || 'price_1SNIbRK5buyKUL7SdvsisPRv',
  BUNDLE: process.env.NEXT_PUBLIC_PRICE_BUNDLE_ID || 'price_1SNIbjK5buyKUL7SBbVhwhAp',
};

const pricingTiers = [
   {
    name: 'Screener Access', price: '$50/year', features: ['Exclusive Stock Lists', 'Access to Screener Page', 'Blurred Deep Dive Names'], priceId: STRIPE_PRICE_IDS.SCREENER,
  },
  {
    name: 'Deep Dive Access', price: '$50/year', features: ['Unlimited Research Reports', 'Full Company Analysis', 'PDF Downloads'], priceId: STRIPE_PRICE_IDS.DEEP_DIVE,
  },
  {
    name: 'The Bundle', price: '$90/year', features: ['Everything in Screener & Deep Dive', 'Highest Value', 'Premium Support'], priceId: STRIPE_PRICE_IDS.BUNDLE,
  },
];

export default function PricingPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  // --- CHECKOUT HANDLER ---
  const handleCheckout = async (priceId: string) => {
    // Client-side checks
    if (!isSignedIn) {
      alert("Please log in to purchase a subscription.");
      return;
    }
    if (!priceId || !priceId.startsWith('price_')) {
        alert("Invalid Price ID configured for this plan. Please contact support.");
        return;
    }

    setLoadingPriceId(priceId); // Set loading state for this button

    try {
      // Call the server API using POST
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }), // Send priceId in the body
        credentials: 'include', // <-- Ensures cookies are sent
      });

      // --- Error Handling ---
      if (!response.ok) {
        const errorText = await response.text();
        let specificError = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          specificError = errorJson.error || errorText;
        } catch (e) { }
        throw new Error(specificError || `Request failed with status ${response.status}`);
      }
      // ----------------------

      // If response was OK, parse JSON and redirect
      const { url } = await response.json();
      if (url) {
        window.location.assign(url); // Redirect to Stripe Checkout
      } else {
        throw new Error("Received an invalid response from the server (missing checkout URL).");
      }

    } catch (error: any) {
      console.error("Checkout initiation failed:", error);
      alert(`Could not start checkout: ${error.message}`);
      setLoadingPriceId(null); // Reset loading state on error
    }
  };
  // ------------------------------------------------------------------

  if (!isLoaded) {
    return <div className="p-20 text-center">Loading plans...</div>;
  }

  // Render the pricing page UI
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
                disabled={!isLoaded || loadingPriceId === tier.priceId}
              >
                {loadingPriceId === tier.priceId
                  ? 'Redirecting...'
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