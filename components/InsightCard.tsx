// components/InsightCard.tsx
import Link from 'next/link'; // Import Link for navigation

// Define the props the component expects
interface InsightCardProps {
  title: string;
  summary?: string; // Summary is optional
  slug?: string;    // Slug is optional but needed for the link
}

export default function InsightCard({ title, summary, slug }: InsightCardProps) {
  const cardContent = (
    // Styling the card
    <div className="flex h-full flex-col rounded border bg-white p-4 shadow transition hover:shadow-lg">
      <h3 className="text-lg font-semibold text-brand-dark">{title}</h3>
      {summary && ( // Only display summary if it exists
        // line-clamp-3 limits the summary to 3 lines with an ellipsis (...)
        <p className="mt-2 flex-grow text-sm text-slate-600 line-clamp-3">
          {summary} 
        </p>
      )}
      {/* Placeholder for future date/author */}
      <p className="mt-4 text-xs text-slate-400">Section • Date</p> 
    </div>
  );

  // If a slug exists, wrap the card content in a link to the insight page
  // The link will go to /insights/your-slug-here (we'll create this page later)
  if (slug) {
    return (
      <Link href={`/insights/${slug}`} className="block"> 
        {cardContent}
      </Link>
    );
  }

  // If no slug, just render the card without a link
  return cardContent;
}