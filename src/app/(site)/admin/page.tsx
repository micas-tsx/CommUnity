'use client'

import { useAuth } from '@/contexts/AuthContext'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { deleteFavor, getAdminFavorsList, getFavorsCount, getFavorsDailyStats, getFavorsTypeStats, getRecentFavorsCount, type AdminFavorListItem, type DailyFavorsStat, type FavorsTypeStats } from '@/services/favors'
import { deleteProfileById, getAdminProfilesList, getProfilesCount, type RecentProfile } from '@/services/profiles'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type ConfirmAction = {
  type: 'favor' | 'profile'
  id: string
}

export default function AdminPage() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()

  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [usersCount, setUsersCount] = useState(0)
  const [favorsCount, setFavorsCount] = useState(0)
  const [recentCount, setRecentCount] = useState(0)
  const [activeTab, setActiveTab] = useState<'favors' | 'profiles'>('favors')
  const [favorsSearch, setFavorsSearch] = useState('')
  const [profilesSearch, setProfilesSearch] = useState('')
  const [favorsPage, setFavorsPage] = useState(1)
  const [profilesPage, setProfilesPage] = useState(1)
  const [favorsTotal, setFavorsTotal] = useState(0)
  const [profilesTotal, setProfilesTotal] = useState(0)
  const [favorsList, setFavorsList] = useState<AdminFavorListItem[]>([])
  const [profilesList, setProfilesList] = useState<RecentProfile[]>([])
  const [listLoading, setListLoading] = useState(false)
  const [typeStats, setTypeStats] = useState<FavorsTypeStats>({ offer: 0, request: 0 })
  const [dailyStats, setDailyStats] = useState<DailyFavorsStat[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null)
  const ITEMS_PER_PAGE = 8

  const isAdmin = userProfile?.role === 'sindico'

  const loadDashboard = useCallback(async () => {
    setDashboardLoading(true)
    try {
      const [profilesCountValue, favorsCountValue, favorsRecent, favorTypes, favorsByDay] = await Promise.all([
        getProfilesCount(),
        getFavorsCount(),
        getRecentFavorsCount(7),
        getFavorsTypeStats(),
        getFavorsDailyStats(7)
      ])

      setUsersCount(profilesCountValue)
      setFavorsCount(favorsCountValue)
      setRecentCount(favorsRecent)
      setTypeStats(favorTypes)
      setDailyStats(favorsByDay)
    } catch (error) {
      console.error('Erro ao carregar dashboard admin:', error)
      toast.error('Não foi possível carregar os dados do dashboard')
    } finally {
      setDashboardLoading(false)
    }
  }, [])

  const loadFavorsList = useCallback(async () => {
    setListLoading(true)
    try {
      const result = await getAdminFavorsList(favorsSearch, favorsPage, ITEMS_PER_PAGE)
      setFavorsList(result.data)
      setFavorsTotal(result.total)
    } catch (error) {
      console.error('Erro ao carregar lista de anúncios:', error)
      toast.error('Não foi possível carregar anúncios')
    } finally {
      setListLoading(false)
    }
  }, [favorsSearch, favorsPage])

  const loadProfilesList = useCallback(async () => {
    setListLoading(true)
    try {
      const result = await getAdminProfilesList(profilesSearch, profilesPage, ITEMS_PER_PAGE)
      setProfilesList(result.data)
      setProfilesTotal(result.total)
    } catch (error) {
      console.error('Erro ao carregar lista de perfis:', error)
      toast.error('Não foi possível carregar perfis')
    } finally {
      setListLoading(false)
    }
  }, [profilesSearch, profilesPage])

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace('/login')
      return
    }

    if (!isAdmin) {
      toast.error('Acesso restrito ao síndico')
      router.replace('/')
      return
    }

    loadDashboard()
  }, [loading, user, isAdmin, router, loadDashboard])

  useEffect(() => {
    if (!user || !isAdmin) return
    if (activeTab !== 'favors') return
    loadFavorsList()
  }, [activeTab, favorsPage, favorsSearch, user, isAdmin, loadFavorsList])

  useEffect(() => {
    if (!user || !isAdmin) return
    if (activeTab !== 'profiles') return
    loadProfilesList()
  }, [activeTab, profilesPage, profilesSearch, user, isAdmin, loadProfilesList])

  const handleDeleteFavor = (favorId: string) => {
    setConfirmAction({ type: 'favor', id: favorId })
  }

  const deleteFavorById = async (favorId: string) => {
    setDeletingId(favorId)
    try {
      await deleteFavor(favorId)
      setFavorsCount((prev) => Math.max(prev - 1, 0))
      await loadFavorsList()
      toast.success('Anúncio excluído com sucesso')
    } catch (error) {
      console.error('Erro ao excluir anúncio:', error)
      toast.error('Não foi possível excluir o anúncio')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDeleteProfile = (profileId: string) => {
    if (!user || profileId === user.id) {
      toast.error('Você não pode excluir o próprio perfil de síndico')
      return
    }

    setConfirmAction({ type: 'profile', id: profileId })
  }

  const deleteProfile = async (profileId: string) => {
    setDeletingProfileId(profileId)
    try {
      await deleteProfileById(profileId)
      setUsersCount((prev) => Math.max(prev - 1, 0))
      await loadProfilesList()
      toast.success('Perfil excluído com sucesso')
    } catch (error) {
      console.error('Erro ao excluir perfil:', error)
      toast.error('Não foi possível excluir o perfil')
    } finally {
      setDeletingProfileId(null)
    }
  }

  const handleConfirmDelete = async () => {
    if (!confirmAction) return

    if (confirmAction.type === 'favor') {
      await deleteFavorById(confirmAction.id)
      setConfirmAction(null)
      return
    }

    await deleteProfile(confirmAction.id)
    setConfirmAction(null)
  }

  if (loading || (!isAdmin && user)) {
    return <p className="text-center mt-20 text-gray-500">Carregando...</p>
  }

  if (!user) {
    return null
  }

  const totalByType = typeStats.offer + typeStats.request
  const offerPercent = totalByType > 0 ? Math.round((typeStats.offer / totalByType) * 100) : 0
  const requestPercent = totalByType > 0 ? Math.round((typeStats.request / totalByType) * 100) : 0
  const maxDailyCount = Math.max(...dailyStats.map((item) => item.count), 1)
  const favorsTotalPages = Math.max(1, Math.ceil(favorsTotal / ITEMS_PER_PAGE))
  const profilesTotalPages = Math.max(1, Math.ceil(profilesTotal / ITEMS_PER_PAGE))

  return (
    <div className="flex-1 bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className=" text-xl md:text-3xl font-black text-gray-900 mb-6">Painel do Síndico</h1>

        {dashboardLoading ? (
          <p className="text-center py-10">Carregando dados do dashboard...</p>
        ) : (
          <>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm text-gray-500">Usuários cadastrados</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{usersCount}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm text-gray-500">Anúncios totais</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{favorsCount}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm text-gray-500">Anúncios (últimos 7 dias)</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{recentCount}</p>
              </div>
            </div>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Anúncios por tipo</h2>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-700 mb-1">
                      <span>Oferta</span>
                      <span>{typeStats.offer} ({offerPercent}%)</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand rounded-full"
                        style={{ width: `${offerPercent}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-gray-700 mb-1">
                      <span>Pedido</span>
                      <span>{typeStats.request} ({requestPercent}%)</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-dark rounded-full"
                        style={{ width: `${requestPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Anúncios por dia (7 dias)</h2>

                {dailyStats.length === 0 ? (
                  <p className="text-gray-500">Sem dados para o período.</p>
                ) : (
                  <div className="h-44 flex items-end gap-2">
                    {dailyStats.map((item) => {
                      const barHeight = Math.max((item.count / maxDailyCount) * 100, item.count > 0 ? 10 : 2)
                      const dayLabel = new Date(`${item.date}T00:00:00`).toLocaleDateString('pt-BR', { weekday: 'short' })

                      return (
                        <div key={item.date} className="flex-1 flex flex-col items-center justify-end gap-2">
                          <div className="text-xs text-gray-500">{item.count}</div>
                          <div className="w-full bg-gray-100 rounded-md h-28 flex items-end">
                            <div className="w-full bg-brand rounded-md" style={{ height: `${barHeight}%` }} />
                          </div>
                          <div className="text-xs text-gray-500 capitalize">{dayLabel}</div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('favors')}
                    className={`px-4 py-2 rounded-md font-medium cursor-pointer ${activeTab === 'favors' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Anúncios
                  </button>
                  <button
                    onClick={() => setActiveTab('profiles')}
                    className={`px-4 py-2 rounded-md font-medium cursor-pointer ${activeTab === 'profiles' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Usuários
                  </button>
                </div>

                {activeTab === 'favors' ? (
                  <input
                    value={favorsSearch}
                    onChange={(event) => {
                      setFavorsSearch(event.target.value)
                      setFavorsPage(1)
                    }}
                    placeholder="Buscar por título ou morador"
                    className="w-full md:w-80 border border-gray-200 p-2 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                  />
                ) : (
                  <input
                    value={profilesSearch}
                    onChange={(event) => {
                      setProfilesSearch(event.target.value)
                      setProfilesPage(1)
                    }}
                    placeholder="Buscar por nome ou email"
                    className="w-full md:w-80 border border-gray-200 p-2 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                  />
                )}
              </div>

              {listLoading ? (
                <p className="text-gray-500">Carregando lista...</p>
              ) : activeTab === 'favors' ? (
                <>
                  {favorsList.length === 0 ? (
                    <p className="text-gray-500">Nenhum anúncio encontrado.</p>
                  ) : (
                    <ul className="space-y-3">
                      {favorsList.map((favor) => (
                        <li key={favor.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-100 rounded-lg p-4">
                          <div>
                            <p className="font-semibold text-gray-900">{favor.title}</p>
                            <p className="text-sm text-gray-600">
                              {favor.user_name} · {favor.type === 'OFFER' ? 'Oferta' : 'Pedido'}
                            </p>
                          </div>

                          <button
                            onClick={() => handleDeleteFavor(favor.id)}
                            disabled={deletingId === favor.id}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {deletingId === favor.id ? 'Excluindo...' : 'Excluir'}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500">Página {favorsPage} de {favorsTotalPages}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFavorsPage((prev) => Math.max(1, prev - 1))}
                        disabled={favorsPage === 1}
                        className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => setFavorsPage((prev) => Math.min(favorsTotalPages, prev + 1))}
                        disabled={favorsPage >= favorsTotalPages}
                        className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {profilesList.length === 0 ? (
                    <p className="text-gray-500">Nenhum perfil encontrado.</p>
                  ) : (
                    <ul className="space-y-3">
                      {profilesList.map((profile) => (
                        <li key={profile.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-100 rounded-lg p-4">
                          <div>
                            <p className="font-semibold text-gray-900">{profile.full_name || 'Sem nome'}</p>
                            <p className="text-sm text-gray-600">{profile.email} · {profile.role === 'sindico' ? 'Síndico' : 'Morador'}</p>
                          </div>

                          <button
                            onClick={() => handleDeleteProfile(profile.id)}
                            disabled={deletingProfileId === profile.id || profile.id === user.id}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {deletingProfileId === profile.id ? 'Excluindo...' : 'Excluir'}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500">Página {profilesPage} de {profilesTotalPages}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setProfilesPage((prev) => Math.max(1, prev - 1))}
                        disabled={profilesPage === 1}
                        className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => setProfilesPage((prev) => Math.min(profilesTotalPages, prev + 1))}
                        disabled={profilesPage >= profilesTotalPages}
                        className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                </>
              )}
            </section>
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmAction}
        title="Confirmar exclusão"
        message={
          confirmAction?.type === 'favor'
            ? 'Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.'
            : 'Tem certeza que deseja excluir este perfil? Esta ação não pode ser desfeita.'
        }
        isLoading={Boolean(deletingId || deletingProfileId)}
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
