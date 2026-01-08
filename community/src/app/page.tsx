'use client'

import { supabase } from "@/libs/supabase"
import { useEffect, useState } from "react"
import { Card } from './../components/Cards';
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
    <div  >
      {favor.map(item => (
        <Card
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
  );
}
