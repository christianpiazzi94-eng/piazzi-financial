// types/custom-claims.d.ts
import '@clerk/nextjs/server';

// Define the possible roles for our application
export type AppRole = 'free' | 'screener' | 'analyses' | 'bundle';

// Extend Clerk's SessionClaims interface
declare module '@clerk/nextjs/server' {
  interface SessionClaims {
    metadata: {
      role?: AppRole; // This is the custom claim read from the JWT
    };
  }
}