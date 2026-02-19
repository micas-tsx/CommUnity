import { supabase } from '@/libs/supabase'

export type RecentFavor = {
  id: string
  title: string
  user_name: string
  type: 'OFFER' | 'REQUEST'
  created_at: string
}

export type FavorsTypeStats = {
  offer: number
  request: number
}

export type DailyFavorsStat = {
  date: string
  count: number
}

export type AdminFavorListItem = {
  id: string
  title: string
  user_name: string
  type: 'OFFER' | 'REQUEST'
  created_at: string
}

export type AdminFavorListResult = {
  data: AdminFavorListItem[]
  total: number
}

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

export const getFavorsCount = async () => {
  const { count, error } = await supabase
    .from('favors')
    .select('*', { count: 'exact', head: true })

  if (error) throw error
  return count || 0
}

export const getRecentFavors = async (limit: number = 8) => {
  const { data, error } = await supabase
    .from('favors')
    .select('id, title, user_name, type, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data || []) as RecentFavor[]
}

export const getAdminFavorsList = async (
  searchTerm: string = '',
  page: number = 1,
  limit: number = 10
): Promise<AdminFavorListResult> => {
  let query = supabase
    .from('favors')
    .select('id, title, user_name, type, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (searchTerm.trim()) {
    query = query.or(`title.ilike.%${searchTerm}%,user_name.ilike.%${searchTerm}%`)
  }

  const { data, error, count } = await query

  if (error) throw error

  return {
    data: (data || []) as AdminFavorListItem[],
    total: count || 0,
  }
}

export const getRecentFavorsCount = async (days: number = 7) => {
  const sinceDate = new Date()
  sinceDate.setDate(sinceDate.getDate() - days)

  const { count, error } = await supabase
    .from('favors')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sinceDate.toISOString())

  if (error) throw error
  return count || 0
}

export const getFavorsTypeStats = async (): Promise<FavorsTypeStats> => {
  const { data, error } = await supabase
    .from('favors')
    .select('type')

  if (error) throw error

  const stats = (data || []).reduce<FavorsTypeStats>((acc, item) => {
    if (item.type === 'OFFER') acc.offer += 1
    if (item.type === 'REQUEST') acc.request += 1
    return acc
  }, { offer: 0, request: 0 })

  return stats
}

export const getFavorsDailyStats = async (days: number = 7): Promise<DailyFavorsStat[]> => {
  const sinceDate = new Date()
  sinceDate.setDate(sinceDate.getDate() - (days - 1))
  sinceDate.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('favors')
    .select('created_at')
    .gte('created_at', sinceDate.toISOString())

  if (error) throw error

  const dayMap = new Map<string, number>()

  for (let index = 0; index < days; index += 1) {
    const date = new Date(sinceDate)
    date.setDate(sinceDate.getDate() + index)
    const key = date.toISOString().split('T')[0]
    dayMap.set(key, 0)
  }

  for (const item of data || []) {
    const key = new Date(item.created_at).toISOString().split('T')[0]
    if (dayMap.has(key)) {
      dayMap.set(key, (dayMap.get(key) || 0) + 1)
    }
  }

  return Array.from(dayMap.entries()).map(([date, count]) => ({ date, count }))
}