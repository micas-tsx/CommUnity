'use client'

import { useState } from "react"
import { supabase } from "@/libs/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function Page() {
  const [title, setTitle] = useState<string>('')
  const [description, SetDescription] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [type, setType] = useState<'OFFER' | 'REQUEST'>('REQUEST')

  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleSubmitForm = async () => {

    if (!user) {
      return
    } else {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      const nomeDoUsuario = profile?.full_name || 'Morador'

      const favorData = {
        title,
        description,
        type,
        category,
        user_name: nomeDoUsuario,
        user_id: user.id
      }

      const { error } = await supabase
        .from('favors')
        .insert([favorData])

      if(error) {
        console.log(error)
      } else {
        router.push('/')
      } 
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Solicite ou crie seu favor</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} >
        <input
          type="text"
          className="border border-gray-200 px-2 py-2 rounded-md"
          placeholder="Titulo do anuncio"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
          className="border border-gray-200 px-2 py-2 rounded-md"
        >
          <option>Escolha um abaixo</option>
          <option>Tecnologia</option>
          <option>Favores em geral</option>
          <option>Educação</option>
          <option>Manutenção</option>
        </select>

        <select
          value={type}
          onChange={e => setType(e.target.value as 'OFFER' | 'REQUEST')}
          className="border border-gray-200 px-2 py-2 rounded-md"
          required
        >
          <option value="REQUEST">Pedido</option>
          <option value="OFFER">Oferta</option>
        </select>

        <textarea
          placeholder="Descrição do seu anuncio (opcional)"
          className="border border-gray-200 px-2 py-2 rounded-md"
          value={description}
          onChange={e => SetDescription(e.target.value)}
        >
        </textarea>

        <button 
          type="button" 
          className="bg-brand hover:bg-brand-dark rounded-md text-white py-4 text-xl cursor-pointer font-bold" 
          onClick={handleSubmitForm}
        >
          Enviar anuncio
        </button>
      </form>

    </div>
  )
}