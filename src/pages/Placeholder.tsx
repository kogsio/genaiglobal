import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';

const Placeholder = () => (
  <PageLayout showContact={false}>
    <SEO title="Content Pending — Gen AI Global" description="Placeholder page." />
    <main className="pt-16 md:pt-20 section-container">
      <h1 className="text-3xl font-bold mb-4">Content Pending</h1>
      <p className="text-muted-foreground">This section will be updated once verified content is provided.</p>
    </main>
  </PageLayout>
);

export default Placeholder;
