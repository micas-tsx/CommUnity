'use client'

import { getFavorsFiltered } from "@/services/favors"
import { useEffect, useState, useCallback, useRef } from "react"
import { FavorCard } from '../components/FavorCards';
import type { Favors } from "@/types/Favors";
import { Search } from "lucide-react";
import { ImpactCounter } from "@/components/ImpactCounter";
import Link from "next/link";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function Home() {
  const [favor, setFavor] = useState<Favors[]>([])
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const isMountedRef = useRef(false)
  const pathname = usePathname()
  const lastPathnameRef = useRef<string | null>(null)

  // NOVO: Estado para controlar o tipo (Todos, Pedido ou Oferta)
  const [filterType, setFilterType] = useState<'ALL' | 'REQUEST' | 'OFFER'>('ALL');

  // Função para buscar dados (memoizada com useCallback)
  const fetchData = useCallback(async () => {
    setLoading(true)

    try {
      const data = await getFavorsFiltered(searchTerm, filterType)
      setFavor(data)
    } catch (error) {
      console.error('Erro ao buscar favores:', error)
      toast.error('Erro ao carregar anúncios')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filterType])

  // Detecta quando volta para a página principal
  useEffect(() => {
    // Se mudou de outra página para a principal, força recarregamento
    if (lastPathnameRef.current && lastPathnameRef.current !== pathname && pathname === '/') {
      fetchData()
    }
    lastPathnameRef.current = pathname
  }, [pathname, fetchData])

  // Carrega dados quando o componente monta ou quando os filtros mudam
  useEffect(() => {
    // Primeira vez que monta: carrega imediatamente
    if (!isMountedRef.current) {
      isMountedRef.current = true
      fetchData()
      return
    }

    // Quando os filtros mudam: usa debounce se houver termo de busca
    if (searchTerm) {
      const timeOutId = setTimeout(() => fetchData(), 300)
      return () => clearTimeout(timeOutId)
    } else {
      fetchData()
    }
  }, [fetchData, searchTerm, filterType])

  return (
    <div className="flex-1 bg-gray-50 py-10">
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

        {/* BOTÕES DE FILTRO (TABS) E IMPACT COUNTER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div className="flex gap-2 items-center w-full md:w-auto">
            {[
              { label: 'Tudo', value: 'ALL' },
              { label: 'Pedidos', value: 'REQUEST' },
              { label: 'Ofertas', value: 'OFFER' }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setFilterType(type.value as 'ALL' | 'REQUEST' | 'OFFER')}
                className={`flex-1 md:flex-initial px-6 py-2 rounded-lg items-center font-medium transition-all text-center ${filterType === type.value
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
    </div>
  );
}