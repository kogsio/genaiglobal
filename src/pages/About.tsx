
import { lazy, Suspense, useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import PageLayout from '@/components/PageLayout';
// Lazy-load to prevent SSR issues
const NeonOrgGraph = lazy(() => import('@/components/NeonOrgGraph'));

const About = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return (
    <PageLayout showContact={false}>
      <SEO
        title="About Us — Gen AI Global Organization"
        description="Explore Gen AI Global's organizational structure in an interactive, searchable org chart."
      />
      <main className="pt-16 md:pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">About Gen AI Global</h1>
            <p className="text-muted-foreground">Interactive organizational chart with search, zoom/pan, collapsible groups, and export options.</p>
          </header>
          <section aria-label="Organizational chart" className="relative h-[70vh] sm:h-[75vh] lg:h-[80vh] overflow-hidden rounded-lg border bg-card">
            {isClient ? (
              <Suspense fallback={<div className="flex h-full items-center justify-center text-muted-foreground">Loading org chart...</div>}>
                <NeonOrgGraph />
              </Suspense>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">Loading org chart...</div>
            )}
          </section>
        </div>
      </main>
    </PageLayout>
  );
};

export default About;
