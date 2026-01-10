'use client'

import { supabase } from "@/libs/supabase"
import { useEffect, useState } from "react"
import { FavorCard } from '../components/FavorCards';
import type { Favors } from "@/types/Favors";
import Link from "next/link";

export default function Home() {
  const [favor, setFavor] = useState<Favors[]>([])
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Criamos a query base
      let query = supabase
        .from('favors')
        .select('*')
        .order('created_at', { ascending: false })

      // Se houver algo digitado, filtramos pelo título
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`)
      }

      const { data, error } = await query

      if (!error) setFavor(data || [])
      setLoading(false)
    }

    // Debounce simples: espera o usuário parar de digitar por 300ms
    const timeOutId = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(timeOutId);

  }, [searchTerm])

  return (
    <main>
      <div className="flex items-center m-8 max-w-4xl mx-auto justify-center">
        <input 
          type="text"
          placeholder="O que você está procurando? (ex: furadeira, bolo, carona...)"
          className="w-full p-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading &&
        <p className="text-center py-20 text-gray-400">Carregando favores...</p>
      }
      {!loading && favor.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">Nenhum favor encontrado com "{searchTerm}"</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="text-brand underline mt-2 cursor-pointer hover:text-brand-dark"
          >
            Limpar busca
          </button>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        {favor.map(item => (
          <Link key={item.id} href={`/favor/${item.id}`}>
            <FavorCard
              id={item.id}
              title={item.title}
              description={item.description}
              category={item.category}
              type={item.type}
              user_name={item.user_name}
            />
          </Link>
        ))}
      </div >
    </main>
  );
}
