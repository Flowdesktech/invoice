import PrivacyPolicy from '../../src/views/PrivacyPolicy';

export const metadata = {
  title: 'Privacy Policy',
  description: 'FlowDesk Invoice privacy policy: how we collect, use, and protect your data.',
  alternates: { canonical: 'https://invoice.flowdesk.tech/privacy' },
};

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}
