// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

// --- Configuration (Remains the same) ---
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// --- Singleton Pattern for Stripe Client (Remains the same) ---
declare global {
  var stripe: Stripe | undefined;
}

function getStripeClient(): Stripe {
  if (!global.stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe Secret Key is not configured in environment variables.");
    }
    console.log("Initializing Stripe client...");
    // Initialize without explicit apiVersion to avoid Vercel build conflict
    global.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
  }
  return global.stripe;
}

// Helper to get the correct base URL for redirects (Remains the same)
function getBaseUrl(req: Request): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const host = req.headers.get('host') ?? 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

// Server-side Price ID to Role mapping function (Remains the same)
function getPriceIdToRoleMap(): Record<string, 'screener' | 'deepDive' | 'bundle'> {
    const requiredPriceIds = ['PRICE_SCREENER_ID', 'PRICE_DEEPDIVE_ID', 'PRICE_BUNDLE_ID'] as const;
    for (const key of requiredPriceIds) {
        if (!process.env[key]) {
            throw new Error(`Server configuration error: Environment variable ${key} is missing.`);
        }
    }
    return {
        [process.env.PRICE_SCREENER_ID!]: 'screener',
        [process.env.PRICE_DEEPDIVE_ID!]: 'deepDive',
        [process.env.PRICE_BUNDLE_ID!]: 'bundle',
    };
}

// --- Main POST Handler with Enhanced Logging ---
export async function POST(req: Request) {
  try {
    // --- 1. EARLY SANITY LOGGING (Improved) ---
    console.log('API Route /api/checkout invoked.');
    console.log('Config check:', {
      hasSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
      hasScreenerId: Boolean(process.env.PRICE_SCREENER_ID),
      hasDeepDiveId: Boolean(process.env.PRICE_DEEPDIVE_ID),
      hasBundleId: Boolean(process.env.PRICE_BUNDLE_ID),
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'Not Set',
    });
    // ------------------------------------------

    // This checks Price IDs *before* getting Stripe client
    const PRICE_ID_TO_ROLE_MAP = getPriceIdToRoleMap();

    // Get Stripe client using singleton pattern
    const stripe = getStripeClient();

    // Check Clerk authentication
    const { userId } = await auth();
    if (!userId) {
      console.warn('Unauthorized access attempt: No userId found.');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get priceId from request body
    const { priceId } = await req.json();
    if (!priceId || typeof priceId !== 'string') {
      console.warn(`Bad request: Missing or invalid priceId.`);
      return new NextResponse('Missing or invalid priceId', { status: 400 });
    }

    // Determine role securely
    const role = PRICE_ID_TO_ROLE_MAP[priceId];
    if (!role) {
      console.error(`Invalid Price ID received: ${priceId}`);
      console.error('Available Price IDs in map:', Object.keys(PRICE_ID_TO_ROLE_MAP).join(', '));
      return new NextResponse('Invalid price selected', { status: 400 });
    }

    const baseUrl = getBaseUrl(req);

    // --- 2. LOG KEY MODE & PRICE ID (Improved) ---
    console.log('Attempting Stripe checkout session creation:', {
      userId,
      priceId,
      role,
      keyMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? 'live' : 'test',
    });
    // ------------------------------------------

    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      metadata: { userId, subscriptionRole: role },
      client_reference_id: userId,
    });

    console.log(`Successfully created Stripe session for user ${userId}.`);
    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    // --- 3. DETAILED & CLEARER ERROR HANDLING (Improved) ---
    const errorCode = err?.code || err?.raw?.code;
    const errorMessage = err?.message || err?.raw?.message || 'Unknown server error';

    console.error('--- STRIPE CHECKOUT ERROR ---');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error Type:', err?.type);
    console.error('Error Code:', errorCode);
    console.error('Error Message:', errorMessage);
    if (err?.raw) {
        console.error('Raw Error:', JSON.stringify(err.raw, null, 2));
    }
    console.error('--- END STRIPE CHECKOUT ERROR ---');

    // Return specific messages for common errors
    if (errorCode === 'resource_missing' && /price/i.test(errorMessage)) {
      return new NextResponse('Error: Invalid or mismatched Price ID. Check Vercel environment variables and Stripe account/mode.', { status: 500 });
    }
    if (/Invalid API Key/i.test(errorMessage)) {
      return new NextResponse('Error: Invalid Stripe API key. Check Vercel environment variables and Stripe account/mode.', { status: 500 });
    }
    // Generic fallback error message
    return new NextResponse('Server error creating checkout session. Please check Vercel logs for details.', { status: 500 });
    // -----------------------------------------------------
  }
}