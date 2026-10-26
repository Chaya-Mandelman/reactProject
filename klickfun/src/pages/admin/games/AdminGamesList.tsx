import { useAdminGames } from "@/hooks/admin/useAdminGames"
import { getErrorMessage } from "@/utils/getErrorMessage"
import type { GamesAdminFilters } from "@/types/gamesAdminFilter"
import { AdminGameRow } from "./AdminGameRow"

export function AdminGamesList({ filters }: { filters: GamesAdminFilters }) {
  const { data: games, isLoading, error } = useAdminGames(filters)

  if (isLoading) return <div>טוען משחקים...</div>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הרשימה האחרונה
  if (!games) return <div role="alert">{getErrorMessage(error)}</div>

  return (
    <>
      {error && <div role="alert">{getErrorMessage(error)}</div>}
      {games.length === 0 ? (
        <div>לא נמצאו משחקים</div>
      ) : (
        <ul>
          {games.map((game) => (
            <AdminGameRow key={game.id} game={game} />
          ))}
        </ul>
      )}
    </>
  )
}
