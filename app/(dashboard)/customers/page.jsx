import Customers from '../../../src/views/Customers';

export const metadata = {
  title: 'Customers',
  robots: { index: false, follow: false },
};

export default function CustomersPage() {
  return <Customers />;
}
