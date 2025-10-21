'use client';

import clsx from 'clsx';

type Pill = 'All' | 'Papers' | 'Podcasts' | 'Videos';

export default function CategoryPills({ value, onChange }:{ value:Pill, onChange:(p:Pill)=>void }) {
  const pills:Pill[] = ['All','Papers','Podcasts','Videos'];
  return (
    <div className="flex flex-wrap gap-2">
      {pills.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={clsx(
            'rounded-full border px-3 py-1.5 text-sm',
            value===p ? 'bg-brand text-white border-brand' : 'bg-white text-gray-700 hover:bg-gray-50'
          )}
        >
          {p}
        </button>
      ))}
    </div>
  )
}
