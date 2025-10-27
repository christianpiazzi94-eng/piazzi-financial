// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

// We define ALL public routes to prevent redirection.
export default clerkMiddleware({
  publicRoutes: [
    '/',
    '/insights(.*)',
    '/about',
    '/materials',
    '/portfolio',
    '/press',
    '/subscribe',
    '/login(.*)', // Must include the catch-all for Clerk's internal flow
    '/signup(.*)', // Must include the catch-all for Clerk's internal flow
  ],
});

export const config = {
  // Match all paths except static assets and Next.js internals
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};