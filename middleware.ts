// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define the public routes that bypass the Clerk middleware redirect.
const publicRoutes = createRouteMatcher([
  '/', // Home page
  '/pricing', // Pricing page
  '/sign-in(.*)', // Sign-in pages
  '/sign-up(.*)', // Sign-up pages
  '/api/checkout(.*)', // CRITICAL FIX: DO NOT PROTECT CHECKOUT API
  '/api/webhook/stripe', // Do not protect webhook
  // Add any other public paths (e.g., /materials, /about) if they exist
]);

export default clerkMiddleware((auth, req) => {
  // If the route is NOT public (and it's not a Next.js internal file)
  if (!publicRoutes(req)) {
    // Then require authentication.
    // --- FINAL FIX: Removed parentheses from auth() ---
    auth.protect();
    // ------------------------------------------------
  }
});

// Exclude static files and internal Next.js paths from middleware checking
export const config = {
  matcher: [
    // This matcher ensures the middleware runs on all relevant routes
    '/((?!_next|.*\\..*|api/upload/.*|robots.txt|sitemap.xml).*)',
    '/(api|trpc)(.*)',
  ],
};