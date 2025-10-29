// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define ALL public routes that bypass Clerk's protection redirect
const isPublic = createRouteMatcher([
  '/',                     // Home page
  '/pricing',              // Pricing page
  '/sign-in(.*)',          // Clerk sign-in pages
  '/sign-up(.*)',          // Clerk sign-up pages
  '/api/checkout(.*)',     // Stripe checkout API - MUST BE PUBLIC
  '/api/webhook/stripe',   // Stripe webhook API - MUST BE PUBLIC
  '/favicon.ico',          // Static assets
  '/robots.txt',
  '/sitemap.xml',
  // Add other known public pages like /materials, /about, /press if they exist
  '/materials',
  '/portfolio',
  '/press',
  '/about',
]);

export default clerkMiddleware((auth, req) => {
  // If the request is NOT for a public route, protect it.
  if (!isPublic(req)) {
     auth().protect(); // Use await if needed based on your Clerk version/setup, but often not needed here
  }
});

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!_next|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp|avif|css|js|map|txt)$).*)',
    // Ensure API routes are still processed by middleware (needed for auth() inside them)
    '/(api|trpc)(.*)',
  ],
};