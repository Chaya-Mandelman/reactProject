import { useQuery } from "@tanstack/react-query"
import { getAiStatusApi } from "@/api/ai"
import { queryKeys } from "@/api/queryKeys"
import { useUserId } from "@/hooks/auth/useUserId"

// האם להציג את כפתורי ה-AI. נבדק פעם אחת ונשמר
export function useAiEnabled() {
  const userId = useUserId()
  const { data } = useQuery({ queryKey: queryKeys.aiStatus(userId), queryFn: getAiStatusApi, staleTime: Infinity })
  return data === true
}
