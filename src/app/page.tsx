'use client'

import { supabase } from "@/libs/supabase"
import { useEffect, useState } from "react"
import { FavorCard } from '../components/FavorCards';
import type { Favors } from "@/types/Favors";
import { Search } from "lucide-react";
import { ImpactCounter } from "@/components/ImpactCounter";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Home() {
  const [favor, setFavor] = useState<Favors[]>([])
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // NOVO: Estado para controlar o tipo (Todos, Pedido ou Oferta)
  const [filterType, setFilterType] = useState<'ALL' | 'REQUEST' | 'OFFER'>('ALL');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      let query = supabase
        .from('favors')
        .select('*')
        .eq('is_completed', false)
        .order('created_at', { ascending: false })

      // Filtro de Texto
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`)
      }

      // NOVO: Filtro de Tipo (se não for 'ALL', filtra pelo valor)
      if (filterType !== 'ALL') {
        query = query.eq('type', filterType)
      }

      const { data, error } = await query
      if (!error) setFavor(data || [])
      setLoading(false)
    }

    toast.success('caso tenha algum problema, dê um f5 :D')
    const timeOutId = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(timeOutId);

    
  }, [searchTerm, filterType]) // Roda quando a busca OU o filtro mudar

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* BARRA DE PESQUISA */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Procurar no condomínio..."
            className="w-full p-4 pl-12 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-brand"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search />
          </div>
        </div>

        {/* BOTÕES DE FILTRO (TABS) */}
        <div className="flex justify-between mb-2">

          <div className="flex flex-wrap gap-2 items-center">
            {[
              { label: 'Tudo', value: 'ALL' },
              { label: 'Pedidos', value: 'REQUEST' },
              { label: 'Ofertas', value: 'OFFER' }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setFilterType(type.value as any)}
                className={`px-6 py-2 rounded-lg items-center font-medium transition-all ${filterType === type.value
                  ? 'bg-brand text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand'
                  }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <ImpactCounter />
        </div>

        {/* LISTAGEM DE CARDS */}
        <div className="flex flex-col">
          {loading ? (
            <p className="text-center py-10">Carregando...</p>
          ) : favor.length > 0 ? (
            favor.map(item => (
              <Link key={item.id} href={`/favor/${item.id}`}>
                <FavorCard {...item} />
              </Link>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed">
              <p>Nenhum {filterType === 'ALL' ? 'anúncio' : filterType.toLowerCase()} encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}