'use client'

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { getProfile } from "@/services/profiles"
import { createFavor } from "@/services/favors"

export default function Page() {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [category, setCategory] = useState<string>('Favores em geral')
  const [type, setType] = useState<'OFFER' | 'REQUEST'>('REQUEST')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleSubmitForm = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para criar um anúncio')
      router.push('/login')
      return
    }

    if (!title.trim()) {
      toast.error('Por favor, preencha o título')
      return
    }

    setIsSubmitting(true)

    try {
      const profile = await getProfile(user.id)
      const nomeDoUsuario = profile?.full_name || 'Morador'

      const favorData = {
        title: title.trim(),
        description: description.trim() || null,
        type,
        category,
        user_name: nomeDoUsuario,
        user_id: user.id
      }

      // Chama a rota server-side que insere e envia emails via Resend
      const res = await fetch('/api/favors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favorData)
      })

      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error || 'Erro ao criar favor')
      }

      toast.success("Anúncio criado com sucesso!")
      router.push('/')
    } catch (error) {
      console.error('Erro ao criar anúncio:', error)
      toast.error('Erro ao criar anúncio')
    } finally {
      setIsSubmitting(false)
    }
  }

  return ( 
    <div className="flex-1 flex items-start justify-center py-10">
      <div className="max-w-md w-full mx-4 md:mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Solicite ou crie seu favor</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} >
        <input
          type="text"
          className="border border-gray-200 px-2 py-2 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all rounded-md"
          placeholder="Titulo do anuncio"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
          className="border border-gray-200 px-2 py-2 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all rounded-md"
        >
          <option>Favores em geral</option>
          <option>Tecnologia</option>
          <option>Educação</option>
          <option>Manutenção</option>
        </select>

        <select
          value={type}
          onChange={e => setType(e.target.value as 'OFFER' | 'REQUEST')}
          className="border border-gray-200 px-2 py-2 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all rounded-md"
          required
        >
          <option value="REQUEST">Pedido</option>
          <option value="OFFER">Oferta</option>
        </select>

        <textarea
          placeholder="Descrição do seu anuncio (opcional)"
          className="border border-gray-200 px-2 py-2 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all rounded-md"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
        />

        <button 
          type="button" 
          className="bg-brand hover:bg-brand-dark rounded-md text-white py-4 text-xl cursor-pointer font-bold disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={handleSubmitForm}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar anuncio'}
        </button>
      </form>
      </div>
    </div>
  )
}