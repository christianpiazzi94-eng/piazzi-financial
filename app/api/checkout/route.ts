// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key (sk_test_...)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // apiVersion is removed here.
});

// The Vercel URL where the site is deployed (used for success/cancel redirects)
const VERCEL_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export async function GET(request: Request) {
  // 1. Get user authentication from Clerk
  // --- CRITICAL FIX: ADD 'await' HERE ---
  const { userId } = await auth(); 
  // ------------------------------------
  
  // 2. Extract necessary data from the URL query parameters
  const url = new URL(request.url);
  const priceId = url.searchParams.get('priceId');
  const role = url.searchParams.get('role'); // e.g., 'screener', 'deepDive', 'bundle'

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized: User not logged in.' }, { status: 401 });
  }
  if (!priceId || !role) {
    return NextResponse.json({ error: 'Missing priceId or role in query.' }, { status: 400 });
  }

  try {
    // 3. Create the Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      // CRUCIAL: Attach user ID and desired role as metadata
      metadata: {
        userId: userId,
        subscriptionRole: role, 
      },

      // Redirect URLs
      success_url: `${VERCEL_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${VERCEL_URL}/pricing?canceled=true`,
    });

    // 4. Send the Stripe Checkout URL back to the client
    return NextResponse.json({ url: stripeSession.url });

  } catch (error) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error while creating checkout session.' }, { status: 500 });
  }
}