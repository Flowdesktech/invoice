import RootLanding from './root-landing';

export const metadata = {
  title: 'FlowDesk Invoice - Professional Invoice Management',
  description:
    'Create, send, and manage professional invoices online. Recurring billing, customer management, and automated reminders for small businesses and freelancers.',
  alternates: {
    canonical: 'https://invoice.flowdesk.tech/',
  },
};

export default function Page() {
  return <RootLanding />;
}
