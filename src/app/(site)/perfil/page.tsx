'use client'

import { FavorPerfil } from "@/components/FavorsPerfil"
import { useAuth } from "@/contexts/AuthContext"
import type { Favors } from "@/types/Favors"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { getProfile, upsertProfile } from "@/services/profiles"
import { getFavorsByUser, updateFavor, deleteFavor } from "@/services/favors"

export default function Perfil() {
  const { user, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState('')
  const [apartmentBlock, setApartmentBlock] = useState('')
  const [phone, setPhone] = useState('')

  const [favors, setFavors] = useState<Favors[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      if (!user) return

      try {
        const data = await getProfile(user.id)
        setFullName(data.full_name || '')
        setApartmentBlock(data.apartment_block || '')
        setPhone(data.phone || '')
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
        toast.error('Erro ao carregar dados do perfil')
      }
    }

    const getFavors = async () => {
      if (!user) return

      try {
        const data = await getFavorsByUser(user.id)
        setFavors(data)
      } catch (error) {
        console.error('Erro ao carregar favores:', error)
        toast.error('Erro ao carregar favores')
      }
    }

    getFavors()
    loadProfile()
  }, [user])

  const handleSave = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para atualizar o perfil')
      return
    }

    try {
      await upsertProfile({
        id: user.id,
        full_name: fullName.trim(),
        apartment_block: apartmentBlock.trim(),
        phone: phone.trim(),
      })

      toast.success("Perfil atualizado com sucesso!")
      await refreshProfile?.()
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error('Erro ao atualizar perfil')
    }
  }

  const handleDelete = (favorId: string) => {
    if (!user?.id) {
      toast.error('Você precisa estar logado para deletar favores')
      return
    }
    setShowDeleteConfirm(favorId)
  }

  const confirmDelete = async () => {
    if (!showDeleteConfirm || !user?.id) return

    try {
      await deleteFavor(showDeleteConfirm)
      toast.success("favor removido!")
      setFavors(prevFavors => prevFavors.filter(f => f.id !== showDeleteConfirm))
    } catch (error) {
      console.error('Erro ao deletar favor:', error)
      toast.error('Erro ao deletar favor')
    } finally {
      setShowDeleteConfirm(null)
    }
  }

  const handleCompleteFavor = async (favorId: string) => {
    if (!user?.id) {
      toast.error('Você precisa estar logado para completar favores')
      return
    }

    try {
      await updateFavor(favorId, { is_completed: true })
      toast.success('Parabéns por ajudar a comunidade! 🎉')
      setFavors(prev => prev.map(f => f.id === favorId ? { ...f, is_completed: true } : f))
    } catch (error) {
      console.error('Erro ao completar favor:', error)
      toast.error('Erro ao marcar favor como completo')
    }
  }

  return (
    <div className="flex-1 flex items-start justify-center py-10">
      <div className="max-w-4xl w-full mx-auto px-4 p-6 bg-white rounded-lg shadow-md grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold mb-4">Meus Dados</h1>
        <input
          type="text"
          placeholder="Nome Completo"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="border border-gray-200 p-2 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
        />
        <input
          type="text"
          placeholder="Bloco / Apartamento"
          value={apartmentBlock}
          onChange={e => setApartmentBlock(e.target.value)}
          className="border border-gray-200 p-2 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
        />
        <input
          type="text"
          placeholder="Telefone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="border border-gray-200 p-2 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
        />
        <button
          onClick={handleSave}
          className="bg-brand hover:bg-brand-dark text-white p-2 rounded font-bold cursor-pointer"
        >
          Salvar Perfil
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Meus favores</h2>
        {favors.length === 0 ? (
          <p className="text-gray-500">Nenhum favor encontrado.</p>
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
              onComplete={handleCompleteFavor}
              is_completed={item.is_completed}
            />
          ))
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirmar exclusão</h3>
            <p className="text-gray-600 mb-6">Tem certeza que deseja excluir este favor? Esta ação não pode ser desfeita.</p>
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
    </div>
  )
}