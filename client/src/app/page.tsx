import Dashboard from "./(dashboard)/dashboard/page";
import { auth } from "@/auth"
import StoreProvider from "./redux";

export default async function Home() {
  const session = await auth()

  return (
    <StoreProvider>
      <Dashboard />
    </StoreProvider>
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    //   <p className="text-primary-foreground">{JSON.stringify(session)}</p>
    //   {/* <LogoutButton /> */}
    // </main>
  )

}
