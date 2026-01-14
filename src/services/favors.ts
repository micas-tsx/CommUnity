import { supabase } from '@/libs/supabase'

export const createFavor = async (data: {
  title: string
  description: string | null
  category: string
  type: 'OFFER' | 'REQUEST'
  user_name: string
  user_id: string
}) => {
  const { data: result, error } = await supabase
    .from('favors')
    .insert([data])
    .select()
    .single()

  if (error) throw error
  return result
}

export const getAllFavors = async () => {
  const { data, error } = await supabase
    .from('favors')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getFavorsByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('favors')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getFavorById = async (id: string) => {
  const { data, error } = await supabase
    .from('favors')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const updateFavor = async (id: string, updates: Partial<{
  title: string
  description: string | null
  category: string
  type: 'OFFER' | 'REQUEST'
  is_completed: boolean
}>) => {
  const { data, error } = await supabase
    .from('favors')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteFavor = async (id: string) => {
  const { error } = await supabase
    .from('favors')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export const getFavorsFiltered = async (searchTerm: string = '', filterType: 'ALL' | 'REQUEST' | 'OFFER' = 'ALL', page: number = 1, limit: number = 10) => {
  let query = supabase
    .from('favors')
    .select('*')
    .eq('is_completed', false)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (searchTerm) {
    query = query.ilike('title', `%${searchTerm}%`)
  }

  if (filterType !== 'ALL') {
    query = query.eq('type', filterType)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export const getCompletedFavorsCount = async () => {
  const { count, error } = await supabase
    .from('favors')
    .select('*', { count: 'exact', head: true })
    .eq('is_completed', true)

  if (error) throw error
  return count || 0
}