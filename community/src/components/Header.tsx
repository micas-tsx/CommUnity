import Link from "next/link"

export const Header = () => {
  return (
    <header className="flex px-32 py-4 shadow-sm aling-center justify-between">
      <div className="">
        <a href="/">
          <h1 className="text-3xl font-black text-gray-900 italic">CommUnity.</h1>
          <p className="text-gray-500">O que você pode trocar hoje?</p>
        </a>
      </div>
      <div className="aling-center justify-center flex text-white">
        <Link
          href={'/login'}
          className="aling-center content-center mx-4 rounded-md bg-brand px-6 cursor-pointer"
        >
          Login
        </Link>
        <Link
          href={'/create-add'}
          className="aling-center content-center mx-4 rounded-md bg-brand px-6 cursor-pointer"
        >
          Criar anuncio
        </Link>
      </div>
    </header>
  )
}