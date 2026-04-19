import Blog from '../../src/views/Blog';

export const metadata = {
  title: 'Blog',
  description:
    'Invoicing tips, small business finance advice, and FlowDesk product updates.',
  alternates: { canonical: 'https://invoice.flowdesk.tech/blog' },
};

export default function BlogPage() {
  return <Blog />;
}
