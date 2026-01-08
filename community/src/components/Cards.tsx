import type { Favors } from "@/types/Favors"

export const Card = ({ title, description, category, type, user_name }: Favors) => {
  return(
    <div className="rounded-md m-5 p-4 border border-brand">
      <h2>{title}</h2>
      <div className="m-2">
        <span>{user_name}</span>
        <p>{type}</p>
        <p>{description}</p>
        <p>{category}</p>
      </div>
    </div>
  )
}