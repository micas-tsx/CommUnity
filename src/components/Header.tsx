'use client'

import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/libs/supabase"
import { LogOut, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export const Header = () => {

  const { user, userProfile } = useAuth()

  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }
  return (
    <header className="flex px-32 py-4 shadow-sm items-center justify-between">
      <div className="">
        <a href="/">
          <h1 className="text-3xl font-black text-gray-900 italic">CommUnity</h1>
        </a>
      </div>
      <div className="items-center justify-center flex text-white">
        {!user ? (
          <div className="flex flex-wrap gap-2">
            <Link
              href={'/login'}
              className="items-center content-center h-10 rounded-md bg-brand hover:bg-brand-dark px-6 cursor-pointer"
            >
              Login
            </Link>
            <Link
              href={'/login'}
              className="items-center content-center h-10 rounded-md bg-brand hover:bg-brand-dark px-6 cursor-pointer"
            >
              Criar anuncio
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Link
              href={'/perfil'}
              className="flex gap-2 items-center content-center h-10 rounded-md bg-brand hover:bg-brand-dark px-6 cursor-pointer"
            >
              <User size={14} />
              <span>{userProfile?.full_name || user?.email}</span>
            </Link>
            <Link
              href={'/create-favor'}
              className="items-center content-center h-10 rounded-md bg-brand hover:bg-brand-dark px-6 cursor-pointer"
            >
              Criar anuncio
            </Link>
            <button
              onClick={handleLogout}
              className="bg-brand hover:bg-brand-dark text-white p-2 rounded cursor-pointer"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}