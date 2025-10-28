// components/InsightCard.tsx
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Import cn utility if you use shadcn

interface InsightCardProps {
  _type: 'insight' | 'screener' | 'deepDive';
  title: string;
  summary?: string;
  slug?: string;
  isFree?: boolean; // From Sanity
  userRole?: string; // From Clerk
}

export default function InsightCard({ _type, title, summary, slug, isFree, userRole }: InsightCardProps) {

  // --- BLUR LOGIC ---
  // Should we blur the title?
  // Blur if it's NOT free AND the user does NOT have ANY paid subscription
  const shouldBlur = !isFree && !userRole; // Simple: Blur if not free and not logged in with *any* role.
  // More specific (allows free users to see titles?):
  // const hasPaidAccess = userRole === 'screener' || userRole === 'deepDive' || userRole === 'bundle';
  // const shouldBlur = !isFree && !hasPaidAccess;
  // --------------------

  // Determine link path
  let href = '';
  if (slug) {
    switch (_type) {
      case 'screener':
        href = `/screeners/${slug}`;
        break;
      case 'deepDive':
        href = `/articles/${slug}`; // <-- Use new articles path
        break;
      case 'insight':
      default:
        href = `/insights/${slug}`;
        break;
    }
  }

  const cardContent = (
    <Card className="flex h-full flex-col transition hover:shadow-lg">
      <CardHeader>
        {/* --- APPLY BLUR HERE using cn utility and Tailwind class --- */}
        <CardTitle className={cn(
          "text-lg line-clamp-2",
          shouldBlur && "filter blur-sm select-none" // Apply blur if needed
        )}>
          {title}
        </CardTitle>
        {/* ----------------------------------------------------------- */}
      </CardHeader>
      {summary && (
        <CardContent className="flex-grow text-sm text-slate-600">
          <p className="line-clamp-3">{summary}</p>
        </CardContent>
      )}
      <CardFooter className="text-xs text-slate-400">
        <p>{_type.charAt(0).toUpperCase() + _type.slice(1)} • Date</p>
      </CardFooter>
    </Card>
  );

  if (href) {
    // Add pointer-events-none if blurred to make link unclickable? Or keep clickable?
    return (
      <Link href={href} className={cn("block h-full", shouldBlur && "pointer-events-none")}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}