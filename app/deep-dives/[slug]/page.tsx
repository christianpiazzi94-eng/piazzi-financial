// app/deep-dives/[slug]/page.tsx
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import { client } from '@/sanity/lib/client'; // Import your Sanity client

// --- 1. The Paywall Component ---
function Paywall() {
  return (
    <div className="text-center max-w-lg mx-auto p-8 border rounded-lg shadow-md bg-gray-50">
      <h2 className="text-2xl font-bold text-brand-dark mb-4">
        Access Restricted
      </h2>
      <p className="text-lg text-gray-700 mb-6">
        This premium deep dive is for subscribers only.
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
// We will update this later to show your research from Sanity.
async function PremiumDeepDiveContent({ slug }: { slug: string }) {
  // TODO: Fetch the actual deep dive data from Sanity using the slug
  
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4 capitalize">
        {slug.replace(/-/g, ' ')}
      </h1>
      <div className="prose prose-lg mt-8">
        <p>
          This is the premium, subscribers-only content for the deep dive.
        </p>
        <p>
          Here is where your full company analysis from Sanity will be displayed.
        </p>
      </div>
    </div>
  );
}

// --- 3. The Main Page (Server Component) ---
export default async function DeepDivePage({ params }: { params: { slug: string } }) {
  
  // Get the current user from Clerk
  const user = await currentUser();

  // Get the user's role from their Clerk metadata
  const userRole = user?.publicMetadata.role as string;

  // --- THIS IS THE NEW LOGIC ---
  // It checks for 'deepDive' or 'bundle'
  const hasAccess = userRole === 'deepDive' || userRole === 'bundle';

  return (
    <div className="mx-auto max-w-6xl p-8">
      {/* If hasAccess is true, show the content.
        If hasAccess is false, show the paywall.
      */}
      {hasAccess ? (
        <PremiumDeepDiveContent slug={params.slug} />
      ) : (
        <Paywall />
      )}
    </div>
  );
}