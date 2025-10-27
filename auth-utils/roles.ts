// auth-utils/roles.ts
import { auth } from '@clerk/nextjs/server'; 
import { AppRole } from '../types/custom-claims'; // Use relative path

/**
 * Gets the current user's role string.
 * @returns AppRole or 'unauthorized'
 */
export function getUserRole(): AppRole | 'unauthorized' {
  const { sessionClaims } = auth();
  return (sessionClaims?.metadata?.role as AppRole) || 'unauthorized';
}