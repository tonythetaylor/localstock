import Dashboard from "./(dashboard)/dashboard/page";
import { auth } from "@/auth"
import StoreProvider from "./redux";
import { redirect } from "next/navigation"
import Loading from "./loading";

export default async function Home() {
  const session = await auth()
  console.log(!session?.expires)
  if (!session?.expires) {
    redirect('/login');
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p className="text-primary-foreground">{JSON.stringify(session)}</p>
        {/* <LogoutButton /> */}
      </main>
      // redirect('/dashboard')
    )
  }


}
