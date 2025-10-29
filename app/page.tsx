// app/page.tsx
import Hero from '@/components/Hero';
import InsightDisplay from '@/components/InsightDisplay';
import { client } from '@/sanity/lib/client';
import { currentUser } from '@clerk/nextjs/server'; // <-- Import currentUser

// Interface includes _type, categories, and isFree
interface ContentStub {
  _id: string;
  _type: 'insight' | 'screener' | 'deepDive';
  title?: string;
  slug?: { current: string };
  summary?: string;
  categories?: string[];
  isFree?: boolean; // <-- Need isFree for filtering and blurring.
}

// Query fetches _type, categories, and isFree
async function getAllContent(): Promise<ContentStub[]> {
  const query = `*[_type in ["insight", "screener", "deepDive"]]{
    _id,
    _type,
    title,
    slug,
    summary,
    "categories": categories[]->title,
    isFree // <-- Fetch isFree
  }`;
  try {
    const content = await client.fetch<ContentStub[]>(query);
    return content;
  } catch (error) {
    console.error("Failed to fetch content:", error);
    return [];
  }
}

export default async function Home() {
  const allContent = await getAllContent();

  // --- GET USER ROLE ---
  const user = await currentUser();
  const userRole = user?.publicMetadata.role as string; // e.g., 'screener', 'deepDive', 'bundle'
  // ---------------------

  return (
    <>
      <Hero />
      {/* --- PASS USER ROLE DOWN --- */}
      <InsightDisplay allContent={allContent} userRole={userRole} />
      {/* ------------------------- */}
    </>
  );
}