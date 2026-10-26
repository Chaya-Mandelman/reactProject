import { useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { liveApi } from "@/api/gameRun"
import { queryKeys } from "@/api/queryKeys"
import { useUserId } from "@/hooks/auth/useUserId"

// מצב המשחק החי, מתרענן כל שניה. enabled=false כשאין מזהה תקין
export function useLive(id: number, enabled = true) {
  const userId = useUserId()
  // lastAnswerId נשמר בין רענונים ונשלח כ-afterAnswerId, כדי לקבל רק תשובות חדשות
  const lastAnswerId = useRef<number | undefined>(undefined)

  return useQuery({
    queryKey: queryKeys.live(userId, id),
    queryFn: async () => {
      const live = await liveApi(id, lastAnswerId.current)
      if ("lastAnswerId" in live && live.lastAnswerId !== null) lastAnswerId.current = live.lastAnswerId
      return live
    },
    refetchInterval: 1000,
    enabled,
  })
}
