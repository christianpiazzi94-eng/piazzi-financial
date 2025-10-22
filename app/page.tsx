// app/page.tsx
import Hero from '../components/Hero';
import Section from '../components/Section';
import SectionTabs from '../components/SectionTabs';
import InsightCard from '../components/InsightCard';

export default function Home() {
  return (
    <>
      <Hero />
      <SectionTabs /> {/* This is the first one, which we are keeping */}

      {/* This section holds your grid of cards */}
      <Section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <InsightCard />
          <InsightCard />
          <InsightCard />
          <InsightCard />
          <InsightCard />
          <InsightCard />
          <InsightCard />
          <InsightCard />
          <InsightCard />
        </div>
      </Section>
      
      {/* The duplicated <SectionTabs /> that was here is now REMOVED. */}
    </>
  );
}