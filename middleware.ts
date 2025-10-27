import { clerkMiddleware } from '@clerk/nextjs/server';

// This simple version makes all routes public by default.
// It will fix your build error.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internal files and static assets
    '/((?!.*\\..*|_next).*)', 
    // Run on all API routes
    '/', 
    '/(api|trpc)(.*)'
  ],
};