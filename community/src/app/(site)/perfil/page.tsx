'use client'

import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/libs/supabase"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function Perfil() {
  const { user } = useAuth() // Pega o usuário logado do seu contexto!
  const [fullName, setFullName] = useState('')
  const [apartmentBlock, setApartmentBlock] = useState('')
  const router = useRouter()

  // 1. [Desafio] Tente buscar os dados se eles já existirem no banco
  useEffect(() => {
    async function loadProfile() {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, apartment_block')
          .eq('id', user.id)
          .single()

        if (data) {
          setFullName(data.full_name || '')
          setApartmentBlock(data.apartment_block || '')
        }
      }
    }
    loadProfile()
  }, [user])

  // 2. Função para salvar
  const handleSave = async () => {
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id, // O ID TEM que ser o do Auth
        full_name: fullName,
        apartment_block: apartmentBlock,
      })

    if (!error) {
      alert("Perfil atualizado com sucesso!")
      router.push('/')
    } else {
      console.error(error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Meus Dados</h1>
      <div className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Nome Completo" 
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="border border-gray-200 p-2 rounded"
        />
        <input 
          type="text" 
          placeholder="Bloco / Apartamento" 
          value={apartmentBlock}
          onChange={e => setApartmentBlock(e.target.value)}
          className="border border-gray-200 p-2 rounded"
        />
        <button 
          onClick={handleSave}
          className="bg-brand text-white p-2 rounded font-bold"
        >
          Salvar Perfil
        </button>

      </div>
    </div>
  )
}