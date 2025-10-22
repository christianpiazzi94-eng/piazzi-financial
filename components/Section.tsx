// components/Section.tsx
import React from 'react';

// This component is just a simple wrapper.
// It creates the max-width container and adds padding.

export default function Section({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      {children}
    </section>
  );
}