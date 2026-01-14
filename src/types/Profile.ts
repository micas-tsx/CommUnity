export type ProfileData = {
  phone: string | null
  apartment_block: string | null
}

export type FavorWithProfile = {
  id: string
  title: string
  description: string | null
  type: 'OFFER' | 'REQUEST'
  user_name: string
  user_id: string
  profile: ProfileData | null
}