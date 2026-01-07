export default function Home() {
  const categories = [
    "Manutenção domestica",
    "Tecnologia",
    "Educação",
    "Cuidados",
    "Prestaçãode serviços gerais"
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">O que você precisa hoje?</h1>

      {/* Flex container para colocar os itens lado a lado e com espaço entre eles */}
      <div className="flex flex-wrap gap-4">
        {categories.map(item => (
          <button
            key={item}
            className="bg-brand text-white mx-2 px-4 py-2 rounded-lg font-medium hover:bg-brand-dark transition-colors cursor-pointer"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
