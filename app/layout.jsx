import Providers from './providers';

export const metadata = {
  metadataBase: new URL('https://invoice.flowdesk.tech'),
  title: {
    default: 'FlowDesk Invoice - Professional Invoice Management',
    template: '%s | FlowDesk Invoice',
  },
  description:
    'Create, send, and manage professional invoices online. Recurring billing, customer management, and automated reminders for small businesses and freelancers.',
  applicationName: 'FlowDesk Invoice',
  keywords: [
    'invoice management',
    'online invoicing',
    'recurring invoices',
    'small business invoicing',
    'freelance invoices',
    'invoice generator',
  ],
  authors: [{ name: 'FlowDesk' }],
  openGraph: {
    type: 'website',
    siteName: 'FlowDesk Invoice',
    url: 'https://invoice.flowdesk.tech',
    title: 'FlowDesk Invoice - Professional Invoice Management',
    description:
      'Create, send, and manage professional invoices online. Recurring billing, customer management, and automated reminders.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlowDesk Invoice',
    description: 'Professional invoice management for small businesses and freelancers.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e293b',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
