import Profile from '../../../src/views/Profile';

export const metadata = {
  title: 'My Profile',
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <Profile />;
}
