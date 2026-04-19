import About from '../../src/views/About';

export const metadata = {
  title: 'About',
  description: 'Learn about FlowDesk and our mission to simplify invoicing for small businesses.',
  alternates: { canonical: 'https://invoice.flowdesk.tech/about' },
};

export default function AboutPage() {
  return <About />;
}
