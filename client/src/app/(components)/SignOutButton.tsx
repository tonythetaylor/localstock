"use client"

import { logout } from "@/lib/actions"
import { useRouter } from "next/navigation"
// import { Button } from "./ui/button"
// import { toast } from "./ui/use-toast"
import { PowerIcon, PowerOff } from "lucide-react"

export default function LogoutButton() {
    const router = useRouter()

    const onLogoutClick = async () => {
        const response = await logout()
        if (response.success) {
            return router.push("/login")
        } else {
            console.log(response.message)
        }
    }


    return (
        <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3" onClick={onLogoutClick}>
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
        </button>
    )
}
