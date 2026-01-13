'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getProfile } from "@/services/profiles"
import { supabase } from '@/libs/supabase'
import { User } from '@supabase/supabase-js'

type UserProfile = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  [key: string]: any // adicione outros campos que tiver na tabela
}

type AuthContextType = {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  refreshProfile?: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({ user: null, userProfile: null, loading: true, refreshProfile: async () => {} })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Função para buscar perfil do usuário
  const fetchUserProfile = async (userId: string) => {
    try {
      const data = await getProfile(userId)
      setUserProfile(data)
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error)
    }
  }

  // Função para recarregar o perfil
  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id)
    }
  }

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erro ao obter sessão:', error)
        }
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        }
      } catch (error) {
        console.error('Erro inesperado ao obter sessão:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)