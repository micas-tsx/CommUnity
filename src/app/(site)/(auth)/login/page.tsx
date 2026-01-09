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

    /*
      TODO: se der erro aparecer mensagem 
    */
    if (error) {
      alert(error)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Entre na sua conta</h1>
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
          className="border border-gray-200 px-2 py-2 mb-2 rounded-md"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="button" onClick={handleLoggin} className="bg-brand hover:bg-brand-dark text-white p-2 rounded-md cursor-pointer font-bold">Entrar</button>
      </form>
      <div className="flex my-2 gap-1 items-center justify-center text-gray-500">
        não tem conta? <a href="/register">Cadastrar</a>
      </div>
    </div>
  )
}