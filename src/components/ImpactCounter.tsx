import { supabase } from "@/libs/supabase";
import { useEffect, useState } from "react";

export const ImpactCounter = () => {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const getCount = async () => {
      const { count, error } = await supabase
        .from('favors')
        .select('*', { count: 'exact', head: true })
        .eq('is_completed', true);

      if (!error) setCompletedCount(count || 0);
    };
    getCount();
  }, []);

  return (
    <div className="flex px-6 py-2 rounded-lg items-center bg-emerald-50 border border-brand">
      <div className="flex flex-wrap font-medium gap-2 items-center">
        <h3 className="text-brand text-lg">Vizinhos ajudados</h3>
        <span className="text-lg text-brand">{completedCount}</span>
      </div>
    </div>
  )
}