import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the default locale sign-in page
  redirect('/en/sign-in');
}
