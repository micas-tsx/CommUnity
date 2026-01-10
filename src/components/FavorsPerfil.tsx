import type { Favors } from "@/types/Favors"

export function FavorPerfil({ title, description, category, type, user_name, onClick, id, onComplete, is_completed }: Favors) {
  return (
    <div className="bg-white p-5 mx-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow my-4">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${type === 'OFFER' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
          }`}>
          {type === 'OFFER' ? 'OFERTA' : 'PEDIDO'}
        </span>
        <span className="text-xs text-gray-400 uppercase font-semibold">{category}</span>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

      <div className="flex items-center mx-auto gap-2">
        <button
          onClick={() => onComplete?.(id)}
          disabled={is_completed} // Supondo que você receba is_completed nas props
          className={`flex-1 py-2 px-4 rounded-md transition-all ${is_completed
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer'
            }`}
        >
          {is_completed ? 'Concluído ✅' : 'Completar'}
        </button>
        {!is_completed &&
          <button
            onClick={() => onClick?.(id)}
            className="flex-1 cursor-pointer bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
          >
            Deletar
          </button>
        }
      </div>
    </div>
  )
}