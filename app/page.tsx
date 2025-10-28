// app/page.tsx
import Hero from '@/components/Hero';
import InsightDisplay from '@/components/InsightDisplay';
import { client } from '@/sanity/lib/client';

// --- 1. UPDATE INTERFACE: Add _type and categories ---
interface ContentStub {
  _id: string;
  _type: 'insight' | 'screener' | 'deepDive'; // Type identifier
  title?: string;
  slug?: { current: string };
  summary?: string;
  categories?: string[]; // <-- ADDED: To hold category names
}

// --- 2. UPDATE QUERY: Fetch _type and category names ---
async function getAllContent(): Promise<ContentStub[]> {
  const query = `*[_type in ["insight", "screener", "deepDive"]]{
    _id,
    _type, // Get the document type
    title,
    slug,
    summary,
    // Use a projection to get category titles ONLY from 'insight' documents
    "categories": categories[]->title 
  }`;
  try {
    const content = await client.fetch<ContentStub[]>(query);
    return content;
  } catch (error) {
    console.error("Failed to fetch content:", error);
    return [];
  }
}

// The Home component fetches data and renders InsightDisplay
export default async function Home() {
  const allContent = await getAllContent();

  return (
    <>
      <Hero />
      {/* Pass all fetched content to InsightDisplay */}
      <InsightDisplay allContent={allContent} />
    </>
  );
}