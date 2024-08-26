// import { getServerSession } from 'next-auth';
import Form from './form';
import { redirect } from 'next/navigation';
import { auth } from "@/auth"

export default async function RegisterPage() {
 const session = await auth()

//   const session = await getServerSession();
  if (session) {
    redirect('/');
  }
  return <Form />;
}