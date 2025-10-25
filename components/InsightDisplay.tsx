// components/InsightDisplay.tsx
'use client'; // <-- Make this a Client Component

import { useState } from 'react';
import SectionTabs, { type Tab } from './SectionTabs'; // Your existing tabs component
import InsightCard from './InsightCard';             // Your existing card component
import Section from './Section';                     // Your existing section wrapper

// Define the structure of an insight (matching what page.tsx fetches)
interface InsightStub {
  _id: string;
  title?: string;
  slug?: { current: string };
  summary?: string;
  // Add 'categories' if you fetch them later for filtering
}

// Define the props this component expects: the list of all insights
interface InsightDisplayProps {
  allInsights: InsightStub[];
}

export default function InsightDisplay({ allInsights }: InsightDisplayProps) {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState<Tab>('All Insights');

  // Placeholder for filtering logic (currently shows all insights)
  // TODO: Implement actual filtering based on activeTab and insight categories
  const filteredInsights = allInsights; // In the future, filter this array

  return (
    <>
      {/* Render the tabs, passing state */}
      <SectionTabs active={activeTab} onChange={setActiveTab} />

      {/* Render the section containing the filtered insight cards */}
      <Section>
        {/* We removed the h2 from here, as it's better placed in page.tsx */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInsights && filteredInsights.length > 0 ? (
            filteredInsights.map((insight) => (
              <InsightCard
                key={insight._id}
                title={insight.title ?? 'Untitled Insight'}
                summary={insight.summary}
                slug={insight.slug?.current}
              />
            ))
          ) : (
            <p className="text-slate-600 col-span-full"> {/* Span across grid if empty */}
              No insights found {activeTab !== 'All Insights' ? `for "${activeTab}"` : 'yet'}.
            </p>
          )}
        </div>
      </Section>
    </>
  );
}