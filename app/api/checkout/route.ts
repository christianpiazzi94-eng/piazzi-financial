// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

// --- CRITICAL FIXES FOR VERCEL BUILD ---
// 1. Forces the route to run dynamically at request time (fixes prerender error)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
// ------------------------------------

// Initialize Stripe once outside the function (Vercel will inject the key at runtime)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

// Helper function to get the base URL correctly in production/development
function getBaseUrl(request: Request) {
  // 1. Try to get Vercel's URL directly from the environment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // 2. Fallback to current request headers (reliable on localhost)
  const host = request.headers.get('host');
  if (host) {
    return `http://${host}`; // Use http for localhost
  }
  // 3. Absolute last resort (should not be hit)
  return 'http://localhost:3000';
}

export async function GET(request: Request) {
  // 1. Get base URL for redirects
  const baseUrl = getBaseUrl(request);
  
  // 2. Get user authentication from Clerk (this is the actual auth check)
  const { userId } = await auth(); 

  // 3. Extract data
  const url = new URL(request.url);
  const priceId = url.searchParams.get('priceId');
  const role = url.searchParams.get('role');

  // --- AUTH CHECK: THIS WAS THE BUG TRIGGER ---
  if (!userId) {
    // If the middleware failed, this stops the execution and clearly signals the error.
    return NextResponse.json({ error: 'Unauthorized: User not logged in.' }, { status: 401 });
  }
  if (!priceId || !role) {
    return NextResponse.json({ error: 'Missing priceId or role in query.' }, { status: 400 });
  }
  // --------------------------------------------

  try {
    // 4. Create the Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      metadata: {
        userId: userId,
        subscriptionRole: role, 
      },

      // Use the dynamically determined baseUrl for redirects
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: stripeSession.url });

  } catch (error) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error while creating checkout session.' }, { status: 500 });
  }
}