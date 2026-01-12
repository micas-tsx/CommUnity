import { supabase } from "@/libs/supabase";
import { useEffect, useState } from "react";

export const ImpactCounter = () => {
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCount = async () => {
      try {
        const { count, error } = await supabase
          .from('favors')
          .select('*', { count: 'exact', head: true })
          .eq('is_completed', true);

        if (error) {
          console.error('Erro ao buscar contador:', error);
        } else {
          setCompletedCount(count || 0);
        }
      } catch (error) {
        console.error('Erro inesperado ao buscar contador:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getCount();
  }, []);

  return (
    <div className="flex px-6 py-2 rounded-lg items-center bg-emerald-50 border border-brand w-full md:w-auto">
      <div className="flex flex-wrap font-medium gap-2 items-center">
        <h3 className="text-brand text-lg">Vizinhos ajudados</h3>
        <span className="text-lg text-brand">
          {loading ? '...' : completedCount}
        </span>
      </div>
    </div>
  )
}