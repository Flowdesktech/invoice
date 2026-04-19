import Documentation from '../../src/views/Documentation';

export const metadata = {
  title: 'Documentation',
  description:
    'FlowDesk Invoice documentation: guides for creating invoices, managing customers, and using recurring billing.',
  alternates: { canonical: 'https://invoice.flowdesk.tech/docs' },
};

export default function DocsPage() {
  return <Documentation />;
}
