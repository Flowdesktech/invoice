import PublicInvoiceGenerator from '../../src/views/PublicInvoiceGenerator';

export const metadata = {
  title: 'Try Now - Free Invoice Generator',
  description:
    'Generate a professional invoice for free, no signup required. Download PDF instantly.',
  alternates: { canonical: 'https://invoice.flowdesk.tech/try-now' },
};

export default function TryNowPage() {
  return <PublicInvoiceGenerator />;
}
