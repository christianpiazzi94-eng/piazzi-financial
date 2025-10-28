// app/screeners/[slug]/page.tsx
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import { client } from '@/sanity/lib/client'; // Import your Sanity client

// --- 1. The Paywall Component ---
// This is shown to users who do not have access.
function Paywall() {
  return (
    <div className="text-center max-w-lg mx-auto p-8 border rounded-lg shadow-md bg-gray-50">
      <h2 className="text-2xl font-bold text-brand-dark mb-4">
        Access Restricted
      </h2>
      <p className="text-lg text-gray-700 mb-6">
        This premium screener is for subscribers only.
      </p>
      {/* This will eventually link to your Stripe pricing page */}
      <Button asChild className="bg-brand-dark text-white hover:bg-brand-dark/90">
        <Link href="/">View Subscription Plans</Link>
      </Button>
    </div>
  );
}

// --- 2. The Premium Content Component ---
// This is shown to users who HAVE paid.
// We will update this later to show your list of stocks from Sanity.
async function PremiumScreenerContent({ slug }: { slug: string }) {
  // TODO: Fetch the actual screener data from Sanity using the slug
  
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4 capitalize">
        {slug.replace(/-/g, ' ')}
      </h1>
      <div className="prose prose-lg mt-8">
        <p>
          This is the premium, subscribers-only content for the screener.
        </p>
        <p>
          Here is where your list of 15 stocks from Sanity will be displayed.
        </p>
      </div>
    </div>
  );
}

// --- 3. The Main Page (Server Component) ---
// This component decides which of the two components above to show.
export default async function ScreenerPage({ params }: { params: { slug: string } }) {
  
  // Get the current user from Clerk
  const user = await currentUser();

  // Get the user's role from their Clerk metadata
  // We will set this metadata later using Stripe
  const userRole = user?.publicMetadata.role as string;

  // This is your paywall logic!
  const hasAccess = userRole === 'screener' || userRole === 'bundle';

  return (
    <div className="mx-auto max-w-6xl p-8">
      {/* If hasAccess is true, show the content.
        If hasAccess is false, show the paywall.
      */}
      {hasAccess ? (
        <PremiumScreenerContent slug={params.slug} />
      ) : (
        <Paywall />
      )}
    </div>
  );
}