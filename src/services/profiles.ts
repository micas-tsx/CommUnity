import { supabase } from '@/libs/supabase'

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const createProfile = async (data: {
  id: string
  email: string
  full_name?: string
  phone?: string | null
  apartment_block?: string | null
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
}) => {
  const { data: result, error } = await supabase
    .from('profiles')
    .upsert(data)
    .select()
    .single()

  if (error) throw error
  return result
}