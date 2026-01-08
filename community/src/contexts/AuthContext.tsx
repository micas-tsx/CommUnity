'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/libs/supabase'
import { User } from '@supabase/supabase-js'

// Criamos o molde do que nosso contexto vai entregar
type AuthContextType = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Checa se já tem um usuário logado ao carregar a página
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // 2. Fica ouvindo mudanças (Login, Logout, Cadastro)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para facilitar o uso nos componentes
export const useAuth = () => useContext(AuthContext)