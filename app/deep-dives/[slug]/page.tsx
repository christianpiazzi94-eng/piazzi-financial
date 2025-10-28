// app/deep-dives/[slug]/page.tsx
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { PortableText } from '@portabletext/react'; // <-- Import the rich text renderer

// --- 1. Define the Types for our Sanity Data ---
interface DeepDive {
  title?: string;
  ticker?: string;
  researchBody?: any[]; // This is the Portable Text (Rich Text) array
}

// --- 2. The Sanity Query ---
// This query finds the deep dive by its slug
const deepDiveQuery = groq`
  *[_type == "deepDive" && slug.current == $slug][0] {
    title,
    ticker,
    researchBody
  }
`;

// --- 3. The Paywall Component (No Change) ---
function Paywall() {
  return (
    <div className="text-center max-w-lg mx-auto p-8 border rounded-lg shadow-md bg-gray-50">
      <h2 className="text-2xl font-bold text-brand-dark mb-4">
        Access Restricted
      </h2>
      <p className="text-lg text-gray-700 mb-6">
        This premium deep dive is for subscribers only.
      </p>
      <Button asChild className="bg-brand-dark text-white hover:bg-brand-dark/90">
        <Link href="/">View Subscription Plans</Link>
      </Button>
    </div>
  );
}

// --- 4. The Premium Content Component (Updated) ---
// It now accepts the 'deepDive' data as a prop
async function PremiumDeepDiveContent({ deepDive }: { deepDive: DeepDive }) {
  const { title, ticker, researchBody } = deepDive;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">
        {title} ({ticker})
      </h1>
      
      {/* This is your Rich Text content.
        The <PortableText> component renders your Sanity 'researchBody'
        The 'prose' classes add beautiful default styling for text.
      */}
      <div className="prose prose-lg dark:prose-invert mt-8 max-w-none">
        <PortableText value={researchBody || []} />
      </div>
    </div>
  );
}

// --- 5. The Main Page (Updated) ---
// It now fetches data from Sanity before rendering
export default async function DeepDivePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // Get the current user from Clerk
  const user = await currentUser();
  const userRole = user?.publicMetadata.role as string;
  const hasAccess = userRole === 'deepDive' || userRole === 'bundle';

  // If the user doesn't have access, show the paywall immediately.
  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <Paywall />
      </div>
    );
  }

  // --- If user HAS access, fetch the data ---
  const deepDive = await client.fetch<DeepDive>(deepDiveQuery, { slug });

  if (!deepDive) {
    return <div className="mx-auto max-w-6xl p-8">Deep dive not found.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-8">
      <PremiumDeepDiveContent deepDive={deepDive} />
    </div>
  );
}