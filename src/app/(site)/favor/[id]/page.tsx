'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { House, Phone, User, ArrowLeft, MessageCircle, MapPin } from "lucide-react"
import { FavorWithProfile } from "@/types/Profile"
import toast from "react-hot-toast"
import { getFavorById } from "@/services/favors"
import { getProfile } from "@/services/profiles"
import Link from "next/link"

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

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500">Carregando detalhes...</p>
      </div>
    </div>
  )
  
  if (!favor) return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-gray-500 text-lg">Anúncio não encontrado.</p>
      <Link href="/" className="text-brand hover:underline flex items-center gap-2">
        <ArrowLeft size={20} /> Voltar para home
      </Link>
    </div>
  )

  const phoneNumber = favor.profile?.phone?.replace(/\D/g, '') || ''
  const whatsappMessage = encodeURIComponent('Olá vim do CommUnity, vi seu anúncio e gostaria de ajudar!')
  const whatsappLink = phoneNumber 
    ? `https://wa.me/${phoneNumber}?text=${whatsappMessage}`
    : '#'

  const isOffer = favor.type === 'OFFER'

  return (
    <div className="flex-1 bg-gray-50 py-6 px-4">
      <div className="max-w-lg mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-brand mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">{favor.title}</h1>
              <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full ${
                isOffer 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                {isOffer ? 'OFERTA' : 'PEDIDO'}
              </span>
            </div>
            
            <p className="text-gray-600 text-base leading-relaxed whitespace-pre-wrap">
              {favor.description}
            </p>
          </div>

          <div className="border-t border-gray-100 p-6 bg-linear-to-br from-gray-50 to-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{favor.user_name}</h3>
                <p className="text-sm text-gray-500">Anunciante</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {favor.profile?.apartment_block && (
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <MapPin size={16} className="text-gray-500" />
                  </div>
                  <span className="text-sm">{favor.profile.apartment_block}</span>
                </div>
              )}
              {favor.profile?.phone && (
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Phone size={16} className="text-gray-500" />
                  </div>
                  <span className="text-sm">{favor.profile.phone}</span>
                </div>
              )}
            </div>

            {phoneNumber ? (
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-brand hover:bg-brand-dark text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-brand/20 hover:shadow-brand/30"
              >
                <MessageCircle size={22} />
                <span>Chamar no WhatsApp</span>
              </a>
            ) : (
              <div className="text-center py-4 px-6 bg-gray-100 rounded-xl">
                <p className="text-gray-500 text-sm">Telefone não disponível</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Anúncio publicado via CommUnity
        </p>
      </div>
    </div>
  )
}