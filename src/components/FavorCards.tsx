import type { Favors } from "@/types/Favors"
import { User } from "lucide-react";

export function FavorCard({ title, description, category, type, user_name }: Favors) {
  return (
    <div className="bg-white p-5 my-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          type === 'OFFER' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {type === 'OFFER' ? 'OFERTA' : 'PEDIDO'}
        </span>
        <span className="text-xs text-gray-400 uppercase font-semibold">{category}</span>
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
      
      <div className="flex items-center gap-3 pt-4 border-t border-gray-50 text-gray-500">
        <div className="flex items-center gap-1 text-xs">
          <User size={14} />
          <span>{user_name}</span>
        </div>
      </div>
    </div>
  )
}