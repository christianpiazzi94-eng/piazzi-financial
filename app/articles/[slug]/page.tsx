// app/articles/[slug]/page.tsx
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { PortableText } from '@portabletext/react';

// Interface remains the same
interface DeepDive { /* ... */ }
interface DeepDive {
  title?: string;
  ticker?: string;
  researchBody?: any[];
  isFree?: boolean;
}


// Query remains the same
const deepDiveQuery = groq` /* ... */ `;
const deepDiveQuery = groq`
  *[_type == "deepDive" && slug.current == $slug][0] {
    title,
    ticker,
    researchBody,
    isFree
  }
`;


// Paywall component remains the same
function Paywall() { /* ... */ }
function Paywall() {
  return (
    <div className="text-center max-w-lg mx-auto p-8 border rounded-lg shadow-md bg-gray-50">
      <h2 className="text-2xl font-bold text-brand-dark mb-4">
        Access Restricted
      </h2>
      <p className="text-lg text-gray-700 mb-6">
        Reading this deep dive requires a subscription.
      </p>
      <Button asChild className="bg-brand-dark text-white hover:bg-brand-dark/90">
        <Link href="/">View Subscription Plans</Link>
      </Button>
    </div>
  );
}


// Premium content component remains the same
async function PremiumDeepDiveContent({ deepDive }: { deepDive: DeepDive }) { /* ... */ }
async function PremiumDeepDiveContent({ deepDive }: { deepDive: DeepDive }) {
  const { title, ticker, researchBody } = deepDive;
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">
        {title} ({ticker})
      </h1>
      <div className="prose prose-lg dark:prose-invert mt-8 max-w-none">
        <PortableText value={researchBody || []} />
      </div>
    </div>
  );
}


// Main page component - updated access logic
export default async function DeepDiveArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const deepDive = await client.fetch<DeepDive>(deepDiveQuery, { slug });

  if (!deepDive) {
    return <div className="mx-auto max-w-6xl p-8">Deep dive not found.</div>;
  }

  const isPublic = deepDive.isFree === true;
  const user = await currentUser();
  const userRole = user?.publicMetadata.role as string;

  // --- UPDATED ACCESS LOGIC ---
  // User needs 'deepDive' or 'bundle' role to read paid articles
  const hasPaidAccess = userRole === 'deepDive' || userRole === 'bundle';
  // ---------------------------

  const canView = isPublic || hasPaidAccess;

  return (
    <div className="mx-auto max-w-6xl p-8">
      {canView ? (
        <PremiumDeepDiveContent deepDive={deepDive} />
      ) : (
        <Paywall />
      )}
    </div>
  );
}