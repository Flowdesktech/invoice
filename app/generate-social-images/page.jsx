import SocialImageGenerator from '../../src/components/SocialImageGenerator';

export const metadata = {
  title: 'Social Image Generator',
  description: 'Internal tool for generating social media preview images.',
  robots: { index: false, follow: false },
};

export default function SocialImagesPage() {
  return <SocialImageGenerator />;
}
