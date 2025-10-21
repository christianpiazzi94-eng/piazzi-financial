'use client';

const TABS = [
  'All Insights',
  'Memos from Leadership',
  'Market Commentary',
  'Education',
  'Press',
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
        <div className="flex gap-8 overflow-auto py-4">
          {TABS.map((tab) => {
            const isActive = tab === active;
            return (
              <button
                key={tab}
                onClick={() => onChange(tab)}
                className={`relative whitespace-nowrap pb-3 text-sm font-semibold tracking-wide transition-colors ${
                  isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.toUpperCase()}
                {isActive && (
                  <span className="absolute left-0 bottom-0 h-[3px] w-full bg-[#3B3B98] rounded-full transition-all duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
