import Login from '../../src/views/Login';

export const metadata = {
  title: 'Login',
  description: 'Sign in to your FlowDesk Invoice account to manage invoices and customers.',
  alternates: { canonical: 'https://invoice.flowdesk.tech/login' },
};

export default function LoginPage() {
  return <Login />;
}
