'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"
import { House, Phone, User } from "lucide-react"

export default function FavorDetails() {
  const { id } = useParams() // Pega o ID da URL
  const [favor, setFavor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getDetails() {
      // Busca o anúncio
      const { data: favorData } = await supabase
        .from('favors')
        .select('*')
        .eq('id', id)
        .single()

      if (favorData) {
        // Busca o WhatsApp do dono do anúncio na tabela profiles
        const { data: profileData } = await supabase
          .from('profiles')
          .select('phone, apartment_block')
          .eq('id', favorData.user_id)
          .single()

        setFavor({ ...favorData, profile: profileData })
      }
      setLoading(false)
    }

    if (id) getDetails()
  }, [id])

  if (loading) return <p className="text-center mt-20 text-gray-400">Carregando detalhes...</p>
  if (!favor) return <p className="text-center mt-20">Anúncio não encontrado.</p>

  // Formata o link do Zap: tira espaços/parênteses e monta a URL
  const whatsappLink = `https://wa.me/${favor.profile?.phone?.replace(/\D/g, '')}`

  return (
    <div className="max-w-2xl mx-4 md:mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
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
        <p className="text-gray-700 flex flex-wrap item-center gap-2"> 
          <User size={20} /> 
          Nome: {favor.user_name}
          </p>
        <p className="text-gray-700 flex flex-wrap item-center gap-2">
          <House size={20} />
          Apartamento: {favor.profile.apartment_block}
        </p>
        <p className="text-gray-700 flex flex-wrap item-center gap-2">
          <Phone size={20} />
          Telefone: {favor.profile.phone}
        </p>
        
        <a 
          href={whatsappLink}
          target="_blank"
          className="mt-6 inline-flex items-center justify-center w-full bg-brand text-white font-bold py-3 rounded-md hover:bg-brand-dark transition-colors"
        >
          Chamar no WhatsApp
        </a>
      </div>
    </div>
  )
}