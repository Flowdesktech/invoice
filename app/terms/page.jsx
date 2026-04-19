import TermsOfService from '../../src/views/TermsOfService';

export const metadata = {
  title: 'Terms of Service',
  description: 'FlowDesk Invoice terms of service and acceptable use policy.',
  alternates: { canonical: 'https://invoice.flowdesk.tech/terms' },
};

export default function TermsPage() {
  return <TermsOfService />;
}
