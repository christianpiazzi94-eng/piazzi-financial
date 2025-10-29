// app/api/env-check/route.ts
import { NextResponse } from 'next/server';

// Ensure this route runs dynamically in Node.js
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Helper function to safely get last 4 characters
function last4(v?: string | null): string | null {
  return typeof v === 'string' && v.length > 4 ? `...${v.slice(-4)}` : v === '' ? '(empty)' : null;
}

export async function GET() {
  console.log('--- env-check endpoint hit ---');
  console.log('Raw process.env:', process.env); // Log everything for deeper inspection if needed

  // Check for the presence and get the last 4 chars of critical secrets
  const envData = {
    vercelEnv: process.env.VERCEL_ENV ?? 'Not Set', // production / preview / development
    vercelUrl: process.env.VERCEL_URL ?? 'Not Set',
    nodeEnv: process.env.NODE_ENV ?? 'Not Set', // development / production

    // Check presence (true/false)
    has: {
      STRIPE_SECRET_KEY: Boolean(process.env.STRIPE_SECRET_KEY),
      PRICE_SCREENER_ID: Boolean(process.env.PRICE_SCREENER_ID),
      PRICE_DEEPDIVE_ID: Boolean(process.env.PRICE_DEEPDIVE_ID),
      PRICE_BUNDLE_ID: Boolean(process.env.PRICE_BUNDLE_ID),
      NEXT_PUBLIC_SITE_URL: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
      CLERK_SECRET_KEY: Boolean(process.env.CLERK_SECRET_KEY),
      CLERK_DOMAIN: Boolean(process.env.CLERK_DOMAIN),
      STRIPE_WEBHOOK_SECRET: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    },
    // Show last 4 chars (safe for debugging)
    tail: {
      STRIPE_SECRET_KEY: last4(process.env.STRIPE_SECRET_KEY),
      PRICE_SCREENER_ID: last4(process.env.PRICE_SCREENER_ID),
      PRICE_DEEPDIVE_ID: last4(process.env.PRICE_DEEPDIVE_ID),
      PRICE_BUNDLE_ID: last4(process.env.PRICE_BUNDLE_ID),
      STRIPE_WEBHOOK_SECRET: last4(process.env.STRIPE_WEBHOOK_SECRET),
      CLERK_SECRET_KEY: last4(process.env.CLERK_SECRET_KEY),
    },
    // Show full values for non-secrets
    values: {
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? null,
        CLERK_DOMAIN: process.env.CLERK_DOMAIN ?? null,
    }
  };

  console.log('--- env-check response data ---');
  console.log(JSON.stringify(envData, null, 2));

  return NextResponse.json(envData);
}