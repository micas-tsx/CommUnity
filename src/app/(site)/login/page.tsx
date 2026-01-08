'use client'

import { supabase } from "@/libs/supabase"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLoggin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.error("Erro no login:", error.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  const handleSingUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) console.error("Erro no login:", error.message)

  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Crie sua conta</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} >
        <input
          type="email"
          placeholder="Digite seu email"
          className="border border-gray-200 px-2 py-2 my-2 rounded-md"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Dfigite sua senha"
          className="border border-gray-200 px-2 py-2 my-2 rounded-md"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="button" onClick={handleLoggin} className="bg-brand text-white p-2 mt-4 rounded-md">Entrar</button>
        <button type="button" onClick={handleSingUp} className="text-gray-600 p-2 mt-2 bg-gray-200 rounded-md">Cadastrar</button>
      </form>
    </div>
  )
}