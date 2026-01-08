'use client'

import { useState } from "react"
import { supabase } from "@/libs/supabase"
import type { Favors } from "@/types/Favors"

export default function Page() {
  /*
  TODO: ver como enviar o usuario junto aqui, pq tem que pegar direto do usuário logado
  */
  const handleSubmitForm = async () => {

    console.log(title, description, category, type)
    return
    const { error } = await supabase
      .from('favors')
      .insert([{ title, description, category, type }])
  }

  const [title, setTitle] = useState<string>('')
  const [description, SetDescription] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [type, setType] = useState<'OFFER' | 'REQUEST'>('REQUEST')

  return (
    <div className="">
      <form className="flex flex-col aling-center jutify-center">
        <input
          type="text"
          className=""
          placeholder="Titulo do anuncio"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          placeholder="descrição do seu anuncio"
          className=""
          value={description}
          onChange={e => SetDescription(e.target.value)}
        >
        </textarea>

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
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
        >
          <option value="REQUEST">Pedido</option>
          <option value="OFFER">Oferta</option>
        </select>

        <button onClick={() => handleSubmitForm()}>enviar anuncio</button>
      </form>

    </div>
  )
}