// auth-utils/actions.ts
// This file handles secure server-side logic and redirection.
import 'server-only'; 
import { auth } from '@clerk/nextjs/server'; 
import { redirect } from 'next/navigation';
// Use relative path for safety
import { AppRole } from '../types/custom-claims'; 

// 1. Define the necessary data we want to return
interface AuthCheckResult {
    userId: string;
    userRole: AppRole;
}

/**
 * Performs full authentication and authorization check for a protected page.
 */
export async function checkScreenerAccess(requiredRole: AppRole): Promise<AuthCheckResult> {
    const { userId, sessionClaims } = auth();

    // --- Authentication Check (Redirect if NOT logged in) ---
    if (!userId) {
        // This redirect is performed by Next.js's redirect function
        const loginUrl = `/login?redirect_url=/${requiredRole}`;
        redirect(loginUrl); 
    }

    // --- Authorization Check (Redirect if NOT authorized) ---
    const userRole = (sessionClaims?.metadata?.role as AppRole);
    
    // Check if the role matches the required tier
    const isAuthorized = userRole === requiredRole;
    
    if (!isAuthorized) {
        console.log(`ACCESS DENIED: User [${userId}] Role [${userRole}] does not match Required [${requiredRole}]`);
        // Redirect to the homepage/pricing page if unauthorized
        redirect('/'); 
    }

    // If both checks pass, return the user data
    console.log(`ACCESS GRANTED: User [${userId}] has role [${userRole}].`);
    return { userId, userRole };
}