import { useAdminGamesFilters } from "@/hooks/admin/useAdminGamesFilters"
import { GamesFilterBar } from "@/pages/host/myGames/GamesFilterBar"
import { AdminGamesList } from "./games/AdminGamesList"
import { HostSelect } from "./games/HostSelect"

function GamesManagement() {
  const { filters, updateFilters } = useAdminGamesFilters()

  return (
    <>
      <h1 className="mx-auto w-[calc(100%-2rem)] max-w-5xl mt-10 mb-8 text-center text-4xl font-black tracking-tight md:text-5xl bg-linear-to-b from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(251,191,36,0.55)]">כל המשחקים</h1>
      <HostSelect value={filters.hostId} onChange={(hostId) => updateFilters({ hostId })} />
      <GamesFilterBar filters={filters} onChange={updateFilters} />
      <AdminGamesList filters={filters} />
    </>
  )
}

export default GamesManagement
