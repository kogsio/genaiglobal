import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Linkedin, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import AuroraNebula from '@/components/visuals/AuroraNebula';
import ConstellationParticles from '@/components/visuals/ConstellationParticles';

// Optional: Provide LinkedIn post URNs to embed latest posts. Example: "urn:li:share:123"
const LINKEDIN_POST_URNS: string[] = [];

const Community = () => {
  return (
    <PageLayout showContact={false}>
      <SEO title="Community — Gen AI Global" description="Follow us and join the conversation: LinkedIn and Discord." />
      <main className="relative pt-16 md:pt-20">
        {/* Futuristic background */}
        <AuroraNebula />
        <ConstellationParticles />
        <motion.section 
          className="relative z-10 container mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl flex-col items-center justify-center gap-8 px-4 text-center overflow-visible pb-6"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent text-balance text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl">Get Involved</h1>
          <p className="max-w-2xl text-balance text-muted-foreground">Stay in the loop, meet contributors, and help democratize AI knowledge.</p>
          <div className="mt-2 grid w-full gap-4 sm:grid-cols-2">
            <motion.a
              href="https://www.linkedin.com/company/gen-ai-global/"
              target="_blank"
              rel="noopener noreferrer"
              className="group ripple-pulse relative inline-flex items-center justify-center overflow-hidden rounded-xl border bg-card px-6 py-5 text-lg shadow-[0_0_28px_hsl(var(--accent)/0.35)] ring-1 ring-accent/40"
              aria-label="Follow on LinkedIn"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.8 }}
            >
              <motion.span
                className="pointer-events-none absolute inset-0 -z-10"
                style={{ background: 'radial-gradient(400px 200px at 10% 10%, hsl(var(--accent) / 0.20), transparent 60%)' }}
                animate={{ x: ['-5%', '5%', '-5%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <Linkedin className="mr-2 size-5" /> Follow on LinkedIn
            </motion.a>
            <motion.a
              href="https://discord.gg/Qxt2TAS5"
              target="_blank"
              rel="noopener noreferrer"
              className="group ripple-pulse relative inline-flex items-center justify-center overflow-hidden rounded-xl border bg-card px-6 py-5 text-lg shadow-[0_0_28px_hsl(var(--accent)/0.35)] ring-1 ring-accent/40"
              aria-label="Join our Discord"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.8, delay: 0.05 }}
            >
              <motion.span
                className="pointer-events-none absolute inset-0 -z-10"
                style={{ background: 'radial-gradient(400px 200px at 90% 10%, hsl(var(--accent) / 0.20), transparent 60%)' }}
                animate={{ x: ['5%', '-5%', '5%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <MessageSquare className="mr-2 size-5" /> Join our Discord
            </motion.a>
          </div>
        </motion.section>
      </main>
    </PageLayout>
  );
};

export default Community;
