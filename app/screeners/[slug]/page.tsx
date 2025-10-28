// app/screeners/[slug]/page.tsx
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import { client } from '@/sanity/lib/client'; // Import your Sanity client
import { groq } from 'next-sanity'; // Import groq

// --- 1. Define the Types for our Sanity Data ---
interface Stock {
  _id: string;
  title?: string;
  ticker?: string;
  slug?: { current: string };
  summary?: string;
}

interface Screener {
  title?: string;
  stockList?: Stock[]; // This is now an array of Stock objects
}

// --- 2. The Sanity Query ---
// This query finds the screener by its slug and also fetches
// all the data from the 'deepDives' that are referenced in the 'stockList'
const screenerQuery = groq`
  *[_type == "screener" && slug.current == $slug][0] {
    title,
    "stockList": stockList[]->{
      _id,
      title,
      ticker,
      slug,
      summary
    }
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
        This premium screener is for subscribers only.
      </p>
      <Button asChild className="bg-brand-dark text-white hover:bg-brand-dark/90">
        <Link href="/">View Subscription Plans</Link>
      </Button>
    </div>
  );
}

// --- 4. The Premium Content Component (Updated) ---
// It now accepts the 'screener' data as a prop
async function PremiumScreenerContent({ screener }: { screener: Screener }) {
  const { title, stockList } = screener;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      
      {/* This is your list of stocks */}
      <div className="mt-8 space-y-4">
        {stockList && stockList.length > 0 ? (
          stockList.map((stock) => (
            <Link 
              key={stock._id} 
              href={`/deep-dives/${stock.slug?.current}`} 
              className="block p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-2xl font-semibold text-brand-dark">
                {stock.title} ({stock.ticker})
              </h3>
              <p className="text-gray-600 mt-2">{stock.summary}</p>
            </Link>
          ))
        ) : (
          <p>No stocks have been added to this screener yet.</p>
        )}
      </div>
    </div>
  );
}

// --- 5. The Main Page (Updated) ---
// It now fetches data from Sanity before rendering
export default async function ScreenerPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // Get the current user from Clerk
  const user = await currentUser();
  const userRole = user?.publicMetadata.role as string;
  const hasAccess = userRole === 'screener' || userRole === 'bundle';

  // If the user doesn't have access, show the paywall immediately.
  // No need to fetch data from Sanity.
  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <Paywall />
      </div>
    );
  }

  // --- If user HAS access, fetch the data ---
  const screener = await client.fetch<Screener>(screenerQuery, { slug });

  if (!screener) {
    return <div className="mx-auto max-w-6xl p-8">Screener not found.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-8">
      <PremiumScreenerContent screener={screener} />
    </div>
  );
}