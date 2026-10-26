import { useQuery } from "@tanstack/react-query"
import { getGameApi } from "../../api/games"

// ה-key מתחיל ב-"games", כך שכל invalidate של משחקים מרענן גם אותו
export function useGame(id: number) {
  return useQuery({
    queryKey: ["games", id],
    queryFn: () => getGameApi(id),
  })
}
