// app/page.tsx
// This remains a Server Component for data fetching

import Hero from '../components/Hero';
import Section from '../components/Section'; // Keep Section for the title maybe
import InsightDisplay from '../components/InsightDisplay'; // Import the new Client Component

// Import the Sanity client (same as before)
import { client } from '../sanity/lib/client';

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

      {/* You could add more static sections below here if needed */}
      {/* Example:
      <Section>
        <h2 className="text-3xl font-bold tracking-tight text-brand-dark">About Us</h2>
        <p className="mt-4 text-slate-600">Some static text here...</p>
      </Section>
      */}
    </>
  );
}