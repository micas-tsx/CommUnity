import { supabase } from '@/libs/supabase'
import { ProfileRole, UserProfile } from '@/types/Profile'

export type RecentProfile = {
  id: string
  full_name: string | null
  email: string
  role: ProfileRole
  created_at: string
}

export type AdminProfileListResult = {
  data: RecentProfile[]
  total: number
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as UserProfile
}

export const createProfile = async (data: {
  id: string
  email: string
  full_name?: string
  phone?: string | null
  apartment_block?: string | null
  role?: ProfileRole
}) => {
  const { data: result, error } = await supabase
    .from('profiles')
    .insert([data])
    .select()
    .single()

  if (error) throw error
  return result
}

export const upsertProfile = async (data: {
  id: string
  full_name: string
  apartment_block: string
  phone: string
  role?: ProfileRole
}) => {
  const { data: result, error } = await supabase
    .from('profiles')
    .upsert(data)
    .select()
    .single()

  if (error) throw error
  return result
}

export const getProfilesCount = async () => {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  if (error) throw error
  return count || 0
}

export const getRecentProfiles = async (limit: number = 8) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data || []) as RecentProfile[]
}

export const getAdminProfilesList = async (
  searchTerm: string = '',
  page: number = 1,
  limit: number = 10
): Promise<AdminProfileListResult> => {
  let query = supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (searchTerm.trim()) {
    query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
  }

  const { data, error, count } = await query

  if (error) throw error

  return {
    data: (data || []) as RecentProfile[],
    total: count || 0,
  }
}

export const deleteProfileById = async (profileId: string) => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', profileId)

  if (error) throw error
}