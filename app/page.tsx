// app/page.tsx
import Hero from '@/components/Hero'; 
import Section from '@/components/Section'; 
import InsightDisplay from '@/components/InsightDisplay'; 

// CHANGED: Use @/ alias for sanity client path
import { client } from '@/sanity/lib/client'; 

// Define the expected data structure (same as before)
interface InsightStub {
  _id: string;
  title?: string;
  slug?: { current: string };
  summary?: string;
  // Add categories later if needed for filtering
}

// Async function to get insights (same as before)
async function getInsights(): Promise<InsightStub[]> {
  const query = `*[_type == "insight"]{ _id, title, slug, summary }`; // Fetch necessary fields
  try {
    const insights = await client.fetch<InsightStub[]>(query);
    return insights;
  } catch (error) {
    console.error("Failed to fetch insights:", error);
    return [];
  }
}

// The Home component fetches data and renders InsightDisplay
export default async function Home() {
  const insights = await getInsights();

  return (
    <>
      <Hero />

      {/* Render the InsightDisplay Client Component, passing the fetched data */}
      <InsightDisplay allInsights={insights} />

      {/* Example static section:
      <Section>
        <h2 className="text-3xl font-bold tracking-tight text-brand-dark">About Us</h2>
        <p className="mt-4 text-slate-600">Some static text here...</p>
      </Section>
      */}
    </>
  );
}