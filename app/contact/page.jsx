import Contact from '../../src/views/Contact';

export const metadata = {
  title: 'Contact',
  description: 'Contact FlowDesk support. Get help with your account, billing, or product features.',
  alternates: { canonical: 'https://invoice.flowdesk.tech/contact' },
};

export default function ContactPage() {
  return <Contact />;
}
