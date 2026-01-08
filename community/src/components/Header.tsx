import Link from "next/link"

export const Header = () => {
  return (
    <div className="flex">
      <div className="flex 1 max-w-lg mx-auto justify-left">
        content 1
      </div>
      <div className="">
        <button className="mx-4 border border-brand p-4 cursor-pointer">
          Login
        </button>
        <button className="mx-4 border border-brand p-4 cursor-pointer">
          <Link
            href={'/create-add'}
          />
          criar anuncio
        </button>

      </div>
    </div>
  )
}