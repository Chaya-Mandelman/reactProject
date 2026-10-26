import { api } from "./apiClient"
import type { LiveState } from "@/types/liveState"

// מצב המשחק החי. עם afterAnswerId מגיעות ב-recentAnswers רק תשובות חדשות ממנו
export const liveApi = async (id: number, afterAnswerId?: number): Promise<LiveState> => {
  const response = await api.get<{ live: LiveState }>(`/games/${id}/live`, { params: { afterAnswerId } })
  return response.data.live
}

// כל פעולות ההרצה הן POST בלי גוף, שמחזיר את מצב המשחק החדש
const liveAction = (action: string) => async (id: number): Promise<LiveState> => {
  const response = await api.post<{ live: LiveState }>(`/games/${id}/${action}`)
  return response.data.live
}

export const openLobbyApi = liveAction("lobby")
export const startGameApi = liveAction("start")
export const pauseGameApi = liveAction("pause")
export const resumeGameApi = liveAction("resume")
export const stopGameApi = liveAction("stop")
