// app/page.tsx
// This page now fetches data on the server

import Hero from '../components/Hero';
import Section from '../components/Section';
// Note: We remove SectionTabs for now as it needs client-side state
import InsightCard from '../components/InsightCard';

// 1. Import the Sanity client using the correct relative path
import { client } from '../sanity/lib/client'; 

// 2. Define the expected data structure for an insight
interface InsightStub {
  _id: string; // Sanity's unique ID for the document
  title?: string; // The title field from your Insight schema
  slug?: { current: string }; // The slug field
  summary?: string; // The summary field we added
  // Add other fields you want to display on the card later
}

// 3. Create an async function to get insights from Sanity
async function getInsights(): Promise<InsightStub[]> {
  // GROQ query to fetch all documents of type "insight"
  // Select only the fields needed for the cards
  const query = `*[_type == "insight"]{ _id, title, slug, summary }`; 
  try {
    const insights = await client.fetch<InsightStub[]>(query);
    return insights;
  } catch (error) {
    console.error("Failed to fetch insights:", error);
    return []; // Return empty array on error
  }
}

// 4. Make the Home component async and fetch the data
export default async function Home() {
  const insights = await getInsights();

  return (
    <>
      <Hero />
      {/* <SectionTabs /> Removed for now */}

      <Section>
        <h2 className="text-3xl font-bold tracking-tight text-brand-dark">All Insights</h2>

        {/* 5. Display the fetched insights */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {insights && insights.length > 0 ? (
            insights.map((insight) => (
              // Pass the fetched data to the InsightCard component
              <InsightCard
                key={insight._id}
                title={insight.title ?? 'Untitled Insight'}
                summary={insight.summary}
                slug={insight.slug?.current} 
              />
            ))
          ) : (
            <p className="text-slate-600">No insights published yet.</p> 
          )}
        </div>
      </Section>
    </>
  );
}