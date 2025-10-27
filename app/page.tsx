// app/page.tsx
import Hero from '@/components/Hero'; 
import Section from '@/components/Section'; 
import InsightDisplay from '@/components/InsightDisplay'; 
import { client } from '@/sanity/lib/client'; 

// Define the expected data structure (with 'category')
interface InsightStub {
  _id: string;
  title?: string;
  slug?: { current: string };
  summary?: string;
  category?: string; // <-- This is important
}

// Async function to get insights (fetches 'category')
async function getInsights(): Promise<InsightStub[]> {
  const query = `*[_type == "insight"]{ _id, title, slug, summary, category }`; // <-- Fetches 'category'
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

      {/* This is the main change. 
        We pass ALL insights to InsightDisplay, which will handle the tabs and filtering.
      */}
      <InsightDisplay allInsights={insights} />

    </>
  );
}