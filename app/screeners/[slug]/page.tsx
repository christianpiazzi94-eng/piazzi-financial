// app/screeners/[slug]/page.tsx
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import { client } from '@/sanity/lib/client'; // Import your Sanity client
import { groq } from 'next-sanity'; // Import groq
import { cn } from "@/lib/utils"; // Import cn utility

// --- 1. Define the Types for our Sanity Data ---
interface Stock {
  _id: string;
  title?: string;
  ticker?: string;
  slug?: { current: string };
  summary?: string;
  isFree?: boolean; // Fetch isFree for each stock (set up in schema)
}

interface Screener {
  title?: string;
  stockList?: Stock[]; // This is now an array of Stock objects
}

// --- 2. The Sanity Query ---
const screenerQuery = groq`
  *[_type == "screener" && slug.current == $slug][0] {
    title,
    "stockList": stockList[]->{
      _id,
      title,
      ticker,
      slug,
      summary,
      isFree
    }
  }
`;

// --- 3. The Paywall Component ---
function Paywall() { 
  return (
    <div className="text-center max-w-lg mx-auto p-8 border rounded-lg shadow-md bg-gray-50">
      <h2 className="text-2xl font-bold text-brand-dark mb-4">
        Access Restricted
      </h2>
      <p className="text-lg text-gray-700 mb-6">
        Viewing screener details requires a subscription.
      </p>
      <Button asChild className="bg-brand-dark text-white hover:bg-brand-dark/90">
        <Link href="/">View Subscription Plans</Link>
      </Button>
    </div>
  );
}

// --- 4. The Premium Content Component ---
async function PremiumScreenerContent({ screener, userRole }: { screener: Screener, userRole?: string }) {
  const { title, stockList } = screener;

  // Blur list items if user does NOT have screener or bundle access
  const hasScreenerAccess = userRole === 'screener' || userRole === 'bundle';

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      
      {/* This is your list of stocks */}
      <div className="mt-8 space-y-4">
        {stockList && stockList.length > 0 ? (
          stockList.map((stock) => {
            // Determine blur for individual stock title
            const shouldBlurStock = !hasScreenerAccess && !stock.isFree; // Blur if not free and no access

            return (
              <Link
                key={stock._id}
                href={`/articles/${stock.slug?.current}`} 
                className={cn(
                  "block p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow",
                  shouldBlurStock && "pointer-events-none" // Make blurred links unclickable
                )}
              >
                {/* --- APPLY BLUR TO TITLE --- */}
                <h3 className={cn(
                  "text-2xl font-semibold text-brand-dark",
                   shouldBlurStock && "filter blur-sm select-none"
                )}>
                  {stock.title} ({stock.ticker})
                </h3>
                {/* --------------------------- */}
                <p className="text-gray-600 mt-2">{stock.summary}</p>
              </Link>
            );
          })
        ) : (
          <p>No stocks have been added to this screener yet.</p>
        )}
      </div>
    </div>
  );
}

// --- 5. The Main Page (Server Component) ---
export default async function ScreenerPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  const user = await currentUser();
  const userRole = user?.publicMetadata.role as string;

  // ACCESS CHECK FOR THE WHOLE PAGE
  const hasPageAccess = userRole === 'screener' || userRole === 'bundle';

  if (!hasPageAccess) {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <Paywall />
      </div>
    );
  }

  // If user HAS access, fetch the data
  const screener = await client.fetch<Screener>(screenerQuery, { slug });

  if (!screener) {
    return <div className="mx-auto max-w-6xl p-8">Screener not found.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-8">
      <PremiumScreenerContent screener={screener} userRole={userRole} />
    </div>
  );
}