'use client'

import { supabase } from "@/libs/supabase"
import { useEffect, useState } from "react"
import { FavorCard } from '../components/FavorCards';
import type { Favors } from "@/types/Favors";

export default function Home() {
  const [favor, setFavor] = useState<Favors[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('favors').select('*')
      if(data) {
        setFavor(data)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="max-w-6xl mx-auto my-4">
      {favor.map(item => (
        <FavorCard
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          category={item.category} 
          type={item.type}
          userName={item.userName}
        />
      ))}
    </div >
  );
}
