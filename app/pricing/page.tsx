// app/pricing/page.tsx
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@clerk/nextjs'; // <-- IMPORT useAuth

// --- YOUR LIVE STRIPE PRICE IDs (TEST MODE) ---
const STRIPE_PRICE_IDS = {
  SCREENER: 'price_1SNIb3K5buyKUL7Sy4UX91NF',
  DEEP_DIVE: 'price_1SNIbRK5buyKUL7SdvsisPRv',
  BUNDLE: 'price_1SNIbjK5buyKUL7SBbVhwhAp',
};

const pricingTiers = [
  // ... (Tiers array remains the same) ...
  {
    name: 'Screener Access',
    price: '$50/year',
    role: 'screener',
    features: ['Exclusive Stock Lists', 'Access to Screener Page', 'Blurred Deep Dive Names'],
    priceId: STRIPE_PRICE_IDS.SCREENER,
  },
  {
    name: 'Deep Dive Access',
    price: '$50/year',
    role: 'deepDive',
    features: ['Unlimited Research Reports', 'Full Company Analysis', 'PDF Downloads'],
    priceId: STRIPE_PRICE_IDS.DEEP_DIVE,
  },
  {
    name: 'The Bundle',
    price: '$90/year',
    role: 'bundle',
    features: ['Everything in Screener & Deep Dive', 'Highest Value', 'Premium Support'],
    priceId: STRIPE_PRICE_IDS.BUNDLE,
  },
];

// This function calls the server-side /api/checkout route
const handleCheckout = async (priceId: string, role: string, isSignedIn: boolean) => {
  
  // 1. Check if user is signed in on the client
  if (!isSignedIn) {
    alert("Please log in to purchase a subscription.");
    // Optionally redirect to sign-in page: window.location.assign("/sign-in");
    return;
  }
  
  // 2. Call the API endpoint
  const response = await fetch(`/api/checkout?priceId=${priceId}&role=${role}`);
  const data = await response.json();
  
  if (response.ok && data.url) {
    // 3. Redirects the user to Stripe's secure payment page
    window.location.assign(data.url);
  } else {
    // Handle other errors (the 401 error should now be caught above)
    alert(`Checkout failed: ${data.error || 'Server error'}. Please try again.`);
  }
};

export default function PricingPage() {
  // --- USE CLERK HOOK HERE ---
  const { isLoaded, isSignedIn } = useAuth();
  
  // Disable buttons while auth is loading
  if (!isLoaded) {
    return <div className="p-20 text-center">Loading plans...</div>
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
                // Pass the isSignedIn status to the handler
                onClick={() => handleCheckout(tier.priceId, tier.role, isSignedIn)} 
                className="w-full bg-brand-dark text-white hover:bg-brand-dark/90"
                disabled={!isLoaded}
              >
                {isSignedIn ? 'Subscribe Now (Test: $0.00)' : 'Log In to Subscribe'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}