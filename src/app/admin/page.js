import { redirect } from 'next/navigation';

export default function UsersIndex() {
  redirect('/admin/dashboard');
}