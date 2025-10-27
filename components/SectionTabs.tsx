// components/SectionTabs.tsx
'use client';

import { usePathname } from 'next/navigation';

// --- 1. YOUR NEW TABS ---
// We add "All Insights" back for the filter
const TABS = [
  'All Insights', // This will show all content
  'Screeners',
  'Deep Dives',
  'Market Commentary',
  'Education',
] as const;

export type Tab = typeof TABS[number];

// --- 2. WE ADD 'active' AND 'onChange' PROPS BACK ---
export default function SectionTabs({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* --- 3. This uses 'justify-between' for the layout you wanted --- */}
        <div className="flex justify-between py-4">

          {TABS.map((tab) => {
            const isActive = tab === active;
            return (
              // --- 4. This is a <button> to filter, not a <Link> ---
              <button
                key={tab}
                onClick={() => onChange(tab)}
                
                // --- 5. STYLING FOR HOVER & ACTIVE (LAVENDER) ---
                className={`relative whitespace-nowrap pb-3 text-sm font-semibold tracking-wide transition-colors ${
                  isActive 
                    ? 'text-[#3B3B98]' // Active color
                    : 'text-gray-500 hover:text-[#3B3B98]' // Inactive and Hover color
                }`}
              >
                {tab.toUpperCase()}
                {isActive && (
                  <span className="absolute left-0 bottom-0 h-[4px] w-full bg-[#3B3B98] transition-all duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}