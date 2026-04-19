import Invoices from '../../../src/views/Invoices';

export const metadata = {
  title: 'Invoices',
  robots: { index: false, follow: false },
};

export default function InvoicesPage() {
  return <Invoices />;
}
