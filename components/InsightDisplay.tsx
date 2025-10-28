// components/InsightDisplay.tsx
'use client';

import { useState } from 'react';
import SectionTabs, { type Tab } from './SectionTabs';
import InsightCard from './InsightCard';
import Section from './Section';

interface ContentStub {
  _id: string;
  _type: 'insight' | 'screener' | 'deepDive';
  title?: string;
  slug?: { current: string };
  summary?: string;
  categories?: string[];
  isFree?: boolean;
}

interface InsightDisplayProps {
  allContent: ContentStub[];
  userRole?: string;
}

export default function InsightDisplay({ allContent, userRole }: InsightDisplayProps) {
  const [activeTab, setActiveTab] = useState<Tab>('All Insights');

  // --- NEW FILTER LOGIC ---
  const filteredContent = allContent.filter(item => {
    if (activeTab === 'All Insights') {
        // Show Screeners, Insights, and *only* FREE Deep Dives
        return item._type === 'screener' || item._type === 'insight' || (item._type === 'deepDive' && item.isFree === true);
    }

    // Show Screener lists for BOTH "Screeners" tab AND "Deep Dives" tab
    if (activeTab === 'Screeners' || activeTab === 'Deep Dives') {
        return item._type === 'screener';
    }

    // Other tabs filter Insights by category
    if (item._type === 'insight' && item.categories) {
        return item.categories.some(categoryTitle => categoryTitle === activeTab);
    }

    return false;
  });
  // --------------------------

  return (
    <>
      <SectionTabs active={activeTab} onChange={setActiveTab} />
      <Section>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredContent && filteredContent.length > 0 ? (
            filteredContent.map((item) => (
              <InsightCard
                key={item._id}
                _type={item._type}
                title={item.title ?? `Untitled ${item._type}`}
                summary={item.summary}
                slug={item.slug?.current}
                isFree={item.isFree}
                userRole={userRole}
              />
            ))
          ) : (
            <p className="text-slate-600 col-span-full">
              No content found {activeTab !== 'All Insights' ? `for "${activeTab}"` : 'yet'}.
            </p>
          )}
        </div>
      </Section>
    </>
  );
}