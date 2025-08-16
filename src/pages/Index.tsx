import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <PageLayout showContact={false}>
      <SEO 
        title="Gen AI Global — Responsible AI Community" 
        description="Gen AI Global: An open, responsible AI community. Content pending verification." 
        imageUrl="/lovable-uploads/eed53564-63d3-42ef-ba27-84f9b10a41b0.png"
        keywords={['Gen AI Global', 'responsible AI', 'AI community', 'education', 'research']}
      />
      <main className="relative pt-16 md:pt-20">
        {/* Futuristic background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_10%,hsl(var(--accent)/0.18),transparent_60%)]" />
          <div className="absolute inset-0 opacity-40 [background:radial-gradient(hsl(var(--accent)/0.15)_1px,transparent_1px)] [background-size:24px_24px]" />
          {/* Hero contrast overlay for light/dark, ensures WCAG AA */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background/80" />
        </div>
        <header className="container mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl flex-col items-center justify-center overflow-visible px-4 pb-6 text-center">
          <h1 className="animate-fade-in bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-balance text-5xl font-bold leading-[1.12] tracking-tight text-transparent sm:text-7xl">
            We are democratizing AI knowledge
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-muted-foreground">Open, responsible, and future‑proof. Join a global community building practical AI literacy for everyone.</p>
          <div className="mt-8 flex items-center gap-4">
            <Button asChild size="lg" variant="glow" className="relative px-10 py-6 text-base shadow-[0_0_40px_hsl(var(--accent)/0.55)]">
              <Link to="/community" aria-label="Get involved with the community">Get involved</Link>
            </Button>
          </div>
        </header>
      </main>
    </PageLayout>
  );
};

export default Index;
