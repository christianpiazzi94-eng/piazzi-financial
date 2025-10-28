'use client';

const TABS = [
  'All Insights', 
  'Screeners',
  'Deep Dives', // <-- ADDED BACK
  'Market Commentary',
  'Education',
] as const;

export type Tab = typeof TABS[number];

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
        <div className="flex justify-between py-4 md:overflow-x-hidden overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = tab === active;
            return (
              <button
                key={tab}
                onClick={() => onChange(tab)}
                className={`relative whitespace-nowrap pb-3 text-sm font-semibold tracking-wide transition-colors ${
                  isActive
                    ? 'text-[#3B3B98]'
                    : 'text-gray-500 hover:text-[#3B3B98]'
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