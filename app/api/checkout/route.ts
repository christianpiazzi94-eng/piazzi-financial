// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

// Force dynamic execution and Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Initialize Stripe with pinned API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Use a specific, recent API version
});

// Helper to get the correct base URL for redirects
function getBaseUrl(req: Request): string {
  // 1. Prefer explicit NEXT_PUBLIC_SITE_URL (set in Vercel)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
      return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // 2. Fallback to Vercel's automatic URL
  if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
  }
  // 3. Fallback for local development using request headers
  const host = req.headers.get('host') ?? 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

// --- SERVER-SIDE MAPPING: Price ID -> Role ---
// This prevents users from tampering with the 'role' parameter
const PRICE_ID_TO_ROLE_MAP: Record<string, 'screener' | 'deepDive' | 'bundle'> = {
  [process.env.PRICE_SCREENER_ID!]: 'screener',
  [process.env.PRICE_DEEPDIVE_ID!]: 'deepDive',
  [process.env.PRICE_BUNDLE_ID!]: 'bundle',
};
// ---------------------------------------------

// --- USE POST INSTEAD OF GET ---
export async function POST(req: Request) {
  try {
    // 1. Check authentication (inside the route, as middleware allows access)
    const { userId } = auth();
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Get the Price ID from the request body
    const { priceId } = await req.json();
    if (!priceId || typeof priceId !== 'string') {
        return new NextResponse('Missing or invalid priceId', { status: 400 });
    }

    // 3. Determine the role securely based on the Price ID
    const role = PRICE_ID_TO_ROLE_MAP[priceId];
    if (!role) {
        console.error(`Invalid Price ID received: ${priceId}`);
        return new NextResponse('Invalid price selected', { status: 400 });
    }
    // ----------------------------------------------------

    const baseUrl = getBaseUrl(req);

    // 4. Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      // CRITICAL: Attach metadata for the webhook
      metadata: {
        userId: userId,
        subscriptionRole: role, // Use the server-derived role
      },
      // Optional: Associate checkout with Clerk user ID via client_reference_id
      client_reference_id: userId,
    });

    // 5. Return the session URL
    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error('STRIPE_CHECKOUT_ERROR', err);
    return new NextResponse(err?.message ?? 'Server error creating checkout session', { status: 500 });
  }
}