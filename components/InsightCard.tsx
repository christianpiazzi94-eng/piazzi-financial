// components/InsightCard.tsx
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// --- 1. UPDATE PROPS: Add _type ---
interface InsightCardProps {
  _type: 'insight' | 'screener' | 'deepDive'; // <-- ADDED
  title: string;
  summary?: string;
  slug?: string;
}

export default function InsightCard({ _type, title, summary, slug }: InsightCardProps) {

  // --- 2. DETERMINE LINK PATH BASED ON _type ---
  let href = '';
  if (slug) {
    switch (_type) {
      case 'screener':
        href = `/screeners/${slug}`; // Link to /screeners/[slug]
        break;
      case 'deepDive':
        href = `/deep-dives/${slug}`; // Link to /deep-dives/[slug]
        break;
      case 'insight':
      default:
        href = `/insights/${slug}`; // Default to /insights/[slug]
        break;
    }
  }
  // ------------------------------------------

  const cardContent = (
    <Card className="flex h-full flex-col transition hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
      </CardHeader>
      {summary && (
        <CardContent className="flex-grow text-sm text-slate-600">
          <p className="line-clamp-3">{summary}</p>
        </CardContent>
      )}
      <CardFooter className="text-xs text-slate-400">
         {/* Display the type in the footer (optional) */}
        <p>{_type.charAt(0).toUpperCase() + _type.slice(1)} • Date</p>
      </CardFooter>
    </Card>
  );

  // If a valid href was created, wrap in a link
  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  // Otherwise, render card without link
  return cardContent;
}