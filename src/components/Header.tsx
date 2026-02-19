'use client'

import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/libs/supabase"
import { LogOut, MenuIcon, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const Header = () => {
  const { user, userProfile } = useAuth()
  const [menuOpened, setMenuOpened] = useState(false)
  const isAdmin = userProfile?.role === 'sindico'

  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Erro ao fazer logout:', error)
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error('Erro inesperado ao fazer logout:', error)
    }
  }
  return (
    <header className="relative flex md:px-32 py-4 px-10 shadow-sm items-center justify-between">
      <div>
        <Link href="/">
          <h1 className="md:text-3xl text-xl font-black text-gray-900 italic">CommUnity</h1>
        </Link>
      </div>

      <div
        className="md:hidden cursor-pointer"
        onClick={() => setMenuOpened(!menuOpened)}
      >
        <MenuIcon />
      </div>

      <div className="items-center justify-center md:flex text-white hidden">
        {!user ? (
          <div className="flex flex-wrap gap-2">
            <Link
              href={'/login'}
              className="items-center content-center h-10 rounded-md bg-brand hover:bg-brand-dark px-6 cursor-pointer"
            >
              Login
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
            {isAdmin && (
              <Link
                href={'/admin'}
                className="items-center content-center h-10 rounded-md bg-brand hover:bg-brand-dark px-6 cursor-pointer"
              >
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-brand hover:bg-brand-dark text-white p-2 rounded cursor-pointer"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>

      {menuOpened && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t md:hidden z-50">
          {!user ? (
            <div className="flex flex-col gap-2 p-4">
              <Link
                href={'/login'}
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setMenuOpened(false)}
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-4">
              <Link
                href={'/perfil'}
                className="flex gap-2 items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setMenuOpened(false)}
              >
                <User size={14} />
                <span>{userProfile?.full_name || user?.email}</span>
              </Link>
              <Link
                href={'/create-favor'}
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setMenuOpened(false)}
              >
                Criar anúncio
              </Link>
              {isAdmin && (
                <Link
                  href={'/admin'}
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setMenuOpened(false)}
                >
                  Painel Admin
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout()
                  setMenuOpened(false)
                }}
                className="flex items-center gap-2 py-2 px-4 text-gray-700 hover:bg-gray-100 rounded w-full text-left"
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}