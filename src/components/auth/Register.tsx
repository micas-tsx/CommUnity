'use client'

import { createProfile } from "@/services/profiles"
import { supabase } from "@/libs/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type ChangeEvent } from "react"
import toast from "react-hot-toast"
import z from "zod"

export const Register = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    apartment: '',
    phoneNumber: ''
  })
  const [errors, setErrors] = useState<ErrorStructure>({})

  const schema = z.object({
    name: z.string().min(2, { message: 'nome deve ter pelo menos dois caracteres' }),
    email: z.email({ message: 'email inválido' }),
    password: z.string().min(6, { message: 'senha deve ter pelo menos 6 caracteres' }),
    apartment: z.string().min(1, { message: 'apartamento deve ter pelo menos 1 caracter' }),
    phoneNumber: z.string()
  })
  
  type ErrorStructure = {
    name?: string
    email?: string
    password?: string
    apartment?: string
    phoneNumber?: string
    form?: string
  }

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = schema.safeParse(form)

    if(!result.success) {
      const fieldErrors: any = {}
      result.error.issues.forEach(err => {
        if(err.path[0]) {
          fieldErrors[err.path[0]] = err.message
        }
      })

      setErrors(fieldErrors)
      return
    }

    setErrors({})
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(form => ({...form,[e.target.name]: e.target.value}))
    setErrors(errors => ({ ...errors, [e.target.name]: undefined, form: undefined }))
  }

  const handleRegister = async () => {
    if (!form.email.trim() || !form.password.trim() || !form.name.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      // 1. Cria o usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password.trim()
      })

      if (authError) {
        toast.error("Erro no cadastro: " + authError.message)
        return
      }

      // 2. Se o usuário foi criado, pegamos o ID e salvamos no Profiles
      if (authData.user) {
        try {
          await createProfile({
            id: authData.user.id,
            email: form.email.trim(),
            full_name: form.name.trim(),
            apartment_block: form.apartment.trim(),
            phone: form.phoneNumber.trim(),
          })
          toast.success("Cadastro realizado!")
          router.push('/login')
        } catch (profileError) {
          console.error('Erro ao salvar perfil:', profileError)
          toast.error("Erro ao salvar perfil.")
        }
      }
    } catch (error) {
      console.error('Erro inesperado no cadastro:', error)
      toast.error('Erro inesperado ao realizar cadastro')
    }
  }

  return (
    <div className="max-w-md mx-4 md:mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Crie sua conta</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} >
        <input
          type="email"
          name="email"
          placeholder="Digite seu email"
          className="border border-gray-200 px-2 py-2 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
          required
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        
        <input
          type="password"
          name="password"
          placeholder="Digite sua senha"
          className="border border-gray-200 px-2 py-2 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
          required
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <input
          type="text"
          name="name"
          placeholder="Digite seu nome"
          className="border border-gray-200 px-2 py-2 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
          required
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <input
          type="text"
          name="phoneNumber"
          placeholder="Digite seu zap"
          className="border border-gray-200 px-2 py-2 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
          required
          value={form.phoneNumber}
          onChange={handleChange}
        />
        
        <input
          type="text"
          name="apartment"
          placeholder="Digite seu apartamento com bloco"
          className="border border-gray-200 px-2 py-2 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
          required
          value={form.apartment}
          onChange={handleChange}
        />
        {errors.apartment && <p className="text-red-500 text-sm">{errors.apartment}</p>}

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
        <Link href="/login" className="text-brand hover:underline">Logar</Link>
      </div>
    </div>
  )
}