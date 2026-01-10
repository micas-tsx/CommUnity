'use client'

import { FavorPerfil } from "@/components/FavorsPerfil"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/libs/supabase"
import type { Favors } from "@/types/Favors"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

export default function Perfil() {
  const { user } = useAuth() // Pega o usuário logado do seu contexto!
  const [fullName, setFullName] = useState('')
  const [apartmentBlock, setApartmentBlock] = useState('')
  const [phone, setPhone] = useState('')

  const router = useRouter()

  const [favors, setFavors] = useState<Favors[]>([])

  // 1. [Desafio] Tente buscar os dados se eles já existirem no banco
  useEffect(() => {
    async function loadProfile() {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, apartment_block, phone')
          .eq('id', user.id)
          .single()

        if (data) {
          setFullName(data.full_name || '')
          setApartmentBlock(data.apartment_block || '')
          setPhone(data.phone || '')
        }
      }
    }

    const getFavors = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('favors')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
        if (!error) setFavors(data)
      }
    }
    getFavors()
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
        phone: phone,
      })

    if (!error) {
      /*
        TODO: adicionar o toast aqui
      */
      toast.success("Perfil atualizado com sucesso!")
      router.push('/')
      router.refresh()
    } else {
      /*
        TODO: adicionar o toast aqui
      */
      toast.error("Erro ao atualizar perfil: " + error.message)
    }
  }

  const handleDelete = async (favorId: string) => {
    const confirmacao = confirm("Tens a certeza que queres apagar este anúncio?");

    if (confirmacao) {
      const { error } = await supabase
        .from('favors')
        .delete()
        .eq('id', favorId) // ID do anúncio
        .eq('user_id', user?.id); // Segurança extra: garante que só apaga se for o dono

      if (!error) {
        toast.success("Anúncio removido!");
        // Recarregar os favores após deletar
        const { data } = await supabase
          .from('favors')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: true })
        setFavors(data || [])
      } else {
        toast.error("Erro ao apagar: " + error.message);
      }
    }
  }

  

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold mb-4">Meus Dados</h1>
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
        <input
          type="text"
          placeholder="Telefone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="border border-gray-200 p-2 rounded"
        />
        <button
          onClick={handleSave}
          className="bg-brand hover:bg-brand-dark text-white p-2 rounded font-bold cursor-pointer"
        >
          Salvar Perfil
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Meus Anúncios</h2>
        {favors.length === 0 ? (
          <p className="text-gray-500">Nenhum anúncio encontrado.</p>
        ) : (
          favors.map(item => (
            <FavorPerfil
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              category={item.category}
              type={item.type}
              user_name={item.user_name}
              onClick={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}