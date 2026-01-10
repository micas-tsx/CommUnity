'use client'

import { FavorPerfil } from "@/components/FavorsPerfil"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/libs/supabase"
import type { Favors } from "@/types/Favors"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

export default function Perfil() {
  const { user, userProfile, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState('')
  const [apartmentBlock, setApartmentBlock] = useState('')
  const [phone, setPhone] = useState('')

  const router = useRouter()

  const [favors, setFavors] = useState<Favors[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

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
        if (!error) setFavors(data || [])
      }
    }
    getFavors()
    loadProfile()
  }, [user])

  const handleSave = async () => {
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        apartment_block: apartmentBlock,
        phone: phone,
      })

    if (!error) {
      toast.success("Perfil atualizado com sucesso!")
      await refreshProfile?.()
    } else {
      toast.error("Erro ao atualizar perfil: " + error.message)
    }
  }

  const handleDelete = (favorId: string) => {
    if (!user?.id) {
      toast.error('Você precisa estar logado para deletar anúncios')
      return
    }
    setShowDeleteConfirm(favorId)
  }

  const confirmDelete = async () => {
    if (!showDeleteConfirm || !user?.id) return

    const { error } = await supabase
      .from('favors')
      .delete()
      .eq('id', showDeleteConfirm)
      .eq('user_id', user.id)

    if (!error) {
      toast.success("Anúncio removido!");
      
      // Recarregar os favores após deletar
      setFavors(prevFavors => prevFavors.filter(f => f.id !== showDeleteConfirm));
    } else {
      toast.error("Erro ao apagar: " + error.message)
    }

    setShowDeleteConfirm(null)
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

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirmar exclusão</h3>
            <p className="text-gray-600 mb-6">Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}