import { useAdminGamesFilters } from "@/hooks/admin/useAdminGamesFilters"
import { GamesFilterBar } from "@/components/GamesFilterBar"
import { AdminGamesList } from "./games/AdminGamesList"
import { HostSelect } from "./games/HostSelect"

function GamesManagement() {
  const { filters, updateFilters } = useAdminGamesFilters()

  return (
    <>
      <h1 className="page-title">כל המשחקים</h1>
      <div className="toolbar mb-8 flex flex-wrap items-center justify-between gap-3">
        <HostSelect value={filters.hostId} onChange={(hostId) => updateFilters({ hostId })} />
        <GamesFilterBar filters={filters} onChange={updateFilters} />
      </div>
      <AdminGamesList filters={filters} />
    </>
  )
}

export default GamesManagement
