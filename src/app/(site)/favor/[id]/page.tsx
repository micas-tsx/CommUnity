'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { House, Phone, User } from "lucide-react"
import { FavorWithProfile } from "@/types/Profile"
import toast from "react-hot-toast"
import { getFavorById } from "@/services/favors"
import { getProfile } from "@/services/profiles"

export default function FavorDetails() {
  const { id } = useParams()
  const [favor, setFavor] = useState<FavorWithProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getDetails() {
      if (!id || typeof id !== 'string') {
        setLoading(false)
        return
      }

      try {
        const favorData = await getFavorById(id)

        let profileData = null
        if (favorData.user_id) {
          try {
            profileData = await getProfile(favorData.user_id)
          } catch (profileError) {
            console.warn('Erro ao buscar perfil (não crítico):', profileError)
          }
        }

        setFavor({
          ...favorData,
          profile: profileData ? {
            phone: profileData.phone,
            apartment_block: profileData.apartment_block
          } : null
        })
      } catch (error) {
        console.error('Erro ao buscar favor:', error)
        toast.error('Erro ao carregar anúncio')
      } finally {
        setLoading(false)
      }
    }

    getDetails()
  }, [id])

  if (loading) return <p className="text-center mt-20 text-gray-400">Carregando detalhes...</p>
  if (!favor) return <p className="text-center mt-20">Anúncio não encontrado.</p>

  // Formata o link do Zap: tira espaços/parênteses e monta a URL
  const phoneNumber = favor.profile?.phone?.replace(/\D/g, '') || ''
  const whatsappMessage = encodeURIComponent('Olá vim do community, conseguimos fazer negócio?')
  const whatsappLink = phoneNumber 
    ? `https://wa.me/${phoneNumber}?text=${whatsappMessage}`
    : '#'

  return (
    <div className="flex-1 flex items-start justify-center py-10">
      <div className="max-w-2xl w-full mx-4 md:mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col gap-2 justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{favor.title}</h1>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          favor.type === 'OFFER' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {favor.type === 'OFFER' ? 'OFERTA' : 'PEDIDO'}
        </span>
      </div>

      <p className="text-gray-600 text-lg mb-8 leading-relaxed">
        {favor.description}
      </p>

      <div className="border border-brand pt-6 bg-gray-50 p-4 rounded-lg gap-3">
        <h3 className="font-bold text-gray-800 mb-2">Informações do Morador</h3>
        <p className="text-gray-700 flex flex-wrap items-center gap-2"> 
          <User size={20} /> 
          Nome: {favor.user_name}
        </p>
        {favor.profile?.apartment_block && (
          <p className="text-gray-700 flex flex-wrap items-center gap-2">
            <House size={20} />
            Apartamento: {favor.profile.apartment_block}
          </p>
        )}
        {favor.profile?.phone && (
          <p className="text-gray-700 flex flex-wrap items-center gap-2">
            <Phone size={20} />
            Telefone: {favor.profile.phone}
          </p>
        )}
        
        {phoneNumber ? (
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center w-full bg-brand text-white font-bold py-3 rounded-md hover:bg-brand-dark transition-colors"
          >
            Chamar no WhatsApp
          </a>
        ) : (
          <p className="mt-6 text-center text-gray-500 text-sm">
            Telefone não disponível
          </p>
        )}
      </div>
      </div>
    </div>
  )
}