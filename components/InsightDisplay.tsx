// components/InsightDisplay.tsx
'use client';

import { useState } from 'react';
import SectionTabs, { type Tab } from './SectionTabs';
import InsightCard from './InsightCard';
import Section from './Section';

// --- 1. UPDATE INTERFACE: Add _type and categories ---
interface ContentStub {
  _id: string;
  _type: 'insight' | 'screener' | 'deepDive';
  title?: string;
  slug?: { current: string };
  summary?: string;
  categories?: string[]; // <-- ADDED
}

interface InsightDisplayProps {
  allContent: ContentStub[];
}

export default function InsightDisplay({ allContent }: InsightDisplayProps) {
  const [activeTab, setActiveTab] = useState<Tab>('All Insights');

  // --- 2. NEW, MORE ROBUST FILTERING LOGIC ---
  const filteredContent = allContent.filter(item => {
    // If "All Insights" is selected, show everything
    if (activeTab === 'All Insights') {
      return true;
    }

    // Check for _type match (for Screeners and Deep Dives)
    if (item._type === 'screener' && activeTab === 'Screeners') {
      return true;
    }
    if (item._type === 'deepDive' && activeTab === 'Deep Dives') {
      return true;
    }

    // Check for category match (for Insights)
    if (item._type === 'insight' && item.categories) {
      // Check if any of the item's categories match the active tab
      return item.categories.some(categoryTitle => categoryTitle === activeTab);
    }
    
    // If no match, hide it
    return false;
  });

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