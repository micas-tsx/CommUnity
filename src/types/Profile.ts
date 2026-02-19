export type ProfileData = {
  phone: string | null
  apartment_block: string | null
}

export type ProfileRole = 'morador' | 'sindico'

export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  apartment_block: string | null
  role: ProfileRole
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