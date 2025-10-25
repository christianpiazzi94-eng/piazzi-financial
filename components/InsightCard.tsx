// components/InsightCard.tsx
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription, // Optional: for subtitle or date
  CardFooter,    // Optional: for author or category
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import Shadcn card components

// Define the props the component expects (same as before)
interface InsightCardProps {
  title: string;
  summary?: string;
  slug?: string;
  // Add other props like author, date, category later if needed
}

export default function InsightCard({ title, summary, slug }: InsightCardProps) {
  
  // Build the content using Shadcn Card components
  const cardContent = (
    <Card className="flex h-full flex-col transition hover:shadow-lg"> {/* Apply flex layout */}
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle> {/* Limit title lines */}
        {/* You could put a subtitle or date in CardDescription if needed */}
        {/* <CardDescription>Optional Subtitle/Date</CardDescription> */}
      </CardHeader>
      {summary && ( // Only add CardContent if summary exists
        <CardContent className="flex-grow text-sm text-slate-600"> {/* flex-grow makes content take space */}
          <p className="line-clamp-3">{summary}</p> {/* Limit summary lines */}
        </CardContent>
      )}
      {/* CardFooter could be used for author/category later */}
      <CardFooter className="text-xs text-slate-400">
        <p>Section • Date</p> {/* Placeholder */}
      </CardFooter>
    </Card>
  );

  // If a slug exists, wrap the card content in a link
  if (slug) {
    return (
      <Link href={`/insights/${slug}`} className="block h-full"> {/* Ensure link takes full height */}
        {cardContent}
      </Link>
    );
  }

  // Otherwise, just render the card content without a link
  return cardContent;
}