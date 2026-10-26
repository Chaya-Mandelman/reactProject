import { useAdminGamesFilters } from "@/hooks/admin/useAdminGamesFilters"
import { GamesFilterBar } from "@/pages/host/myGames/GamesFilterBar"
import { AdminGamesList } from "./games/AdminGamesList"
import { HostSelect } from "./games/HostSelect"

function GamesManagement() {
  const { filters, updateFilters } = useAdminGamesFilters()

  return (
    <>
      <h1>כל המשחקים</h1>
      <HostSelect value={filters.hostId} onChange={(hostId) => updateFilters({ hostId })} />
      <GamesFilterBar filters={filters} onChange={updateFilters} />
      <AdminGamesList filters={filters} />
    </>
  )
}

export default GamesManagement
