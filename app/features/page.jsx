import Features from '../../src/views/Features';

export const metadata = {
  title: 'Features',
  description:
    'Explore FlowDesk Invoice features: recurring invoices, customer management, PDF generation, email delivery, and more.',
  alternates: { canonical: 'https://invoice.flowdesk.tech/features' },
};

export default function FeaturesPage() {
  return <Features />;
}
