'use client'

import { supabase } from "@/libs/supabase"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [apartment, setApartment] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault
  }

  const handleRegister = async () => {
    // 1. Cria o usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    })

    if (authError) {
      /* 
      TODO: inserior um toast no lugar desse alert 
      */
      alert("Erro no cadastro: " + authError.message)
      return
    }

    // 2. Se o usuário foi criado, pegamos o ID e salvamos no Profiles
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            full_name: name,
            apartment_block: apartment,
            phone: phoneNumber,
          }
        ])

      if (profileError) {
        /* 
          TODO: inserior um toast no lugar desse alert
        */
        alert(`Erro ao salvar perfil: ${ profileError.message}`)
        alert("Usuário criado, mas houve um erro no perfil.")
      } else {
        /* 
          TODO: inserior um toast no lugar desse alert
        */
        alert("Cadastro realizado! Verifique seu e-mail para confirmar.")
        router.push('/login')
      }
    }

  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Crie sua conta</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} >
        <input
          type="email"
          placeholder="Digite seu email"
          className="border border-gray-200 px-2 py-2 rounded-md"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Digite sua senha"
          className="border border-gray-200 px-2 py-2 rounded-md"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <input
          type="text"
          placeholder="Digite seu nome"
          className="border border-gray-200 px-2 py-2 rounded-md"
          required
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Digite seu zap"
          className="border border-gray-200 px-2 py-2 rounded-md"
          required
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Digite seu apartamento com bloco"
          className="border border-gray-200 px-2 py-2 rounded-md"
          required
          value={apartment}
          onChange={e => setApartment(e.target.value)}
        />

        <button
          type="button"
          onClick={handleRegister}
          className="bg-brand hover:bg-brand-dark text-white p-2 rounded-md cursor-pointer font-bold"
        >
          Cadastrar
        </button>
      </form>
      <div className="flex gap-1 my-2 items-center justify-center text-gray-500">
        já tem conta?
        <a href="/login">Logar</a>
      </div>
    </div>
  )
}