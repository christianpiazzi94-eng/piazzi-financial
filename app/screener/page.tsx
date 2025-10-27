// app/screener/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
// Use the final, correct folder structure for the role check
import { AppRole } from '@/types/custom-claims'; 

// Ensures the page is always dynamically rendered
export const dynamic = 'force-dynamic'; 

const REQUIRED_ROLE = 'screener';

// FIX: Make the component function ASYNC
export default async function ScreenerPage() {
  
  // 1. Get the current session claims directly using the result of auth()
  // NOTE: When called like this in a Server Component, auth() returns the
  // necessary object directly without needing await in older Next versions, 
  // but we still need the component to be async.
  const { userId, sessionClaims } = auth(); 

  // 2. CHECK 1: Authentication (Is user logged in?)
  if (!userId) {
      // If the user is not logged in, redirect them to the /login page
      redirect('/login'); 
  }

  // 3. CHECK 2: Authorization (Does user have the right role?)
  const userRole = sessionClaims?.metadata?.role as AppRole;
  // Check both the primary role and the 'bundle' for access
  const isAuthorized = userRole === REQUIRED_ROLE || userRole === 'bundle'; 

  if (!isAuthorized) {
      console.log(`ACCESS DENIED: User Role [${userRole}] does not match Required [${REQUIRED_ROLE}]`);
      redirect('/'); // Redirect to the homepage if unauthorized
  }

  // 4. If all checks pass, render the content
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-5xl font-serif font-medium text-brand-dark mb-4">
        Premium Stock Screener Access
      </h1>
      <p className="text-xl text-green-700 font-semibold">
        SUCCESS! User ID {userId} has the {userRole} tier access.
      </p>
      <div className="mt-8 p-6 bg-slate-50 border rounded-lg">
        <h2 className="text-2xl font-bold">Protected Content Area</h2>
        <p className="mt-2 text-slate-700">
          This is where your list of best Semiconductor picks will be displayed.
        </p>
      </div>
    </div>
  );
}