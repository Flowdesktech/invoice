import RecurringInvoices from '../../../../../src/views/RecurringInvoices';

export const metadata = {
  title: 'Recurring Invoice History',
  robots: { index: false, follow: false },
};

export default function RecurringInvoiceHistoryPage() {
  return <RecurringInvoices />;
}
