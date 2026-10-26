import { useQuery } from "@tanstack/react-query"
import { liveApi } from "../../api/gameRun"

// מצב המשחק החי, מתרענן כל שניה. enabled=false עד שהלובי נפתח
export function useLive(id: number, enabled = true) {
  return useQuery({
    queryKey: ["live", id],
    queryFn: () => liveApi(id),
    refetchInterval: 1000,
    enabled,
  })
}
