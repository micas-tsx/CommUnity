'use client'

import { supabase } from "@/libs/supabase"
import { useEffect, useState } from "react"
import { FavorCard } from '../components/FavorCards';
import type { Favors } from "@/types/Favors";

export default function Home() {
  const [favor, setFavor] = useState<Favors[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data, error } = await supabase
      .from('favors')
      .select('*')
      .order('created_at', { ascending: false })
      
      if (!error) setFavor(data)
      setLoading(false)
      
    }
    fetchData()
  }, [])

  return (
    <main>
      {loading && 
        <p className="text-center py-20 text-gray-400">Carregando favores...</p>
      }
      <div className="max-w-6xl mx-auto">
        {favor.map(item => (
          <FavorCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            category={item.category}
            type={item.type}
            user_name={item.user_name}
          />
        ))}
      </div >
    </main>
  );
}
