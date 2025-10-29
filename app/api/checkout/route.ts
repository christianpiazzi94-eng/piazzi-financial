// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

// --- 1. FORCE DYNAMIC EXECUTION (Essential for Vercel) ---
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
// ------------------------------------

// --- 2. SINGLETON PATTERN FOR STRIPE CLIENT ---
// Use globalThis to ensure only one instance is created, even with hot-reloading.
declare global {
  // eslint-disable-next-line no-var
  var stripe: Stripe | undefined;
}

function getStripeClient(): Stripe {
  if (!global.stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe Secret Key is not configured.");
    }
    console.log("Initializing Stripe client..."); // Log initialization
    global.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
  }
  return global.stripe;
}
// ---------------------------------------------

// Helper to get the correct base URL for redirects
function getBaseUrl(req: Request): string {
  // Prefer explicit NEXT_PUBLIC_SITE_URL (set in Vercel)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
      return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Fallback to Vercel's automatic URL
  if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
  }
  // Fallback for local development using request headers
  const host = req.headers.get('host') ?? 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

// SERVER-SIDE MAPPING: Price ID -> Role
// Use a function to load this map AFTER checking env vars
function getPriceIdToRoleMap(): Record<string, 'screener' | 'deepDive' | 'bundle'> {
    // Ensure required Price IDs are present before creating the map
    const requiredPriceIds = ['PRICE_SCREENER_ID', 'PRICE_DEEPDIVE_ID', 'PRICE_BUNDLE_ID'] as const;
    for (const key of requiredPriceIds) {
        if (!process.env[key]) {
            // Throw an error that will be caught and logged
            throw new Error(`Server configuration error: Environment variable ${key} is missing.`);
        }
    }

    return {
        [process.env.PRICE_SCREENER_ID!]: 'screener',
        [process.env.PRICE_DEEPDIVE_ID!]: 'deepDive',
        [process.env.PRICE_BUNDLE_ID!]: 'bundle',
    };
}

// USE POST INSTEAD OF GET
export async function POST(req: Request) {
  try {
    // --- 3. GET STRIPE CLIENT USING SINGLETON ---
    const stripe = getStripeClient();
    // ------------------------------------------

    // --- 4. CHECK REQUIRED ENV VARS EARLY ---
    const PRICE_ID_TO_ROLE_MAP = getPriceIdToRoleMap(); // This will throw if IDs are missing
    // ------------------------------------------

    const { userId } = await auth(); // Ensure await is used
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { priceId } = await req.json();
    if (!priceId || typeof priceId !== 'string') {
      return new NextResponse('Missing or invalid priceId', { status: 400 });
    }

    // Determine role securely using the map
    const role = PRICE_ID_TO_ROLE_MAP[priceId];
    if (!role) {
      console.error(`Invalid Price ID received: ${priceId}`);
      // Log available keys for debugging
      console.error('Available Price IDs in map:', Object.keys(PRICE_ID_TO_ROLE_MAP).join(', '));
      return new NextResponse('Invalid price selected', { status: 400 });
    }

    const baseUrl = getBaseUrl(req);

    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      metadata: {
        userId: userId,
        subscriptionRole: role, // Use the server-derived role
      },
      client_reference_id: userId,
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    // Log the specific error
    console.error('STRIPE_CHECKOUT_ERROR:', err.message);
    // Return a generic server error message to the client
    return new NextResponse('Server error creating checkout session. Please check logs.', { status: 500 });
  }
}