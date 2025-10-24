// app/insights/[slug]/page.tsx
// Use alias path '@/...' assuming it maps to the project root
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

import { PortableText } from '@portabletext/react';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// Define the structure of the full insight data we expect
interface FullInsight {
  _id: string;
  title?: string;
  mainImage?: any; // Sanity image object
  body?: any[];    // Array of blocks for Portable Text
  publishedAt?: string;
  author?: { name?: string };
}

// Function to fetch ONE insight based on its slug
async function getInsight(slug: string): Promise<FullInsight | null> {
  const query = `*[_type == "insight" && slug.current == $slug][0]{
    _id,
    title,
    mainImage,
    body,
    publishedAt,
    "author": author->{name}
  }`;
  try {
    const insight = await client.fetch<FullInsight>(query, { slug });
    return insight;
  } catch (error) {
    console.error(`Failed to fetch insight with slug "${slug}":`, error);
    return null;
  }
}

// This is the main page component
export default async function InsightPage({ params }: { params: { slug: string } }) {
  const insight = await getInsight(params.slug);

  if (!insight) {
    notFound();
  }

  const formattedDate = insight.publishedAt
    ? new Date(insight.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Date not available';

  // Check if urlForImage exists and returns a builder before calling methods
  const imageUrl = insight.mainImage && urlForImage(insight.mainImage)
    ? urlForImage(insight.mainImage)?.width(1200).height(800).url()
    : undefined; // Set to undefined if image or builder is missing

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-4 text-4xl font-bold text-brand-dark">{insight.title ?? 'Untitled Insight'}</h1>
      
      <div className="mb-6 text-sm text-slate-500">
        <span>By {insight.author?.name ?? 'Unknown Author'}</span>
        <span className="mx-2">•</span>
        <span>{formattedDate}</span>
      </div>

      {/* Use imageUrl if it was successfully generated */}
      {imageUrl && (
        <div className="relative mb-8 h-64 w-full overflow-hidden rounded md:h-96">
          <Image
            src={imageUrl}
            alt={insight.title ?? 'Insight main image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>
      )}

      {insight.body ? (
        <div className="prose prose-lg max-w-none">
          <PortableText value={insight.body} />
        </div>
      ) : (
        <p>This insight has no content yet.</p>
      )}
    </article>
  );
}