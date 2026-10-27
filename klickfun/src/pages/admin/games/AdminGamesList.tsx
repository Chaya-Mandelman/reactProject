import { useAdminGames } from "@/hooks/admin/useAdminGames"
import { getErrorMessage } from "@/utils/getErrorMessage"
import type { GamesAdminFilters } from "@/types/gamesAdminFilter"
import { AdminGameRow } from "./AdminGameRow"

export function AdminGamesList({ filters }: { filters: GamesAdminFilters }) {
  const { data: games, isLoading, error } = useAdminGames(filters)

  if (isLoading) return <div className="status">טוען משחקים...</div>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הרשימה האחרונה
  if (!games) return <div className="alert" role="alert">{getErrorMessage(error)}</div>

  return (
    <>
      {error && <div className="alert mb-6" role="alert">{getErrorMessage(error)}</div>}
      {games.length === 0 ? (
        <div className="empty">לא נמצאו משחקים</div>
      ) : (
        <ul className="grid gap-5 text-start sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <AdminGameRow key={game.id} game={game} />
          ))}
        </ul>
      )}
    </>
  )
}
