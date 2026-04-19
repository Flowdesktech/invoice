import Register from '../../src/views/Register';

export const metadata = {
  title: 'Create an Account',
  description:
    'Create a free FlowDesk Invoice account in seconds. Start sending professional invoices today.',
  alternates: { canonical: 'https://invoice.flowdesk.tech/register' },
};

export default function RegisterPage() {
  return <Register />;
}
