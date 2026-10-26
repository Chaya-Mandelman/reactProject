import { useParams } from "react-router"

// מזהה המשחק מהכתובת (:gameId). isValid=false אם הוא לא מספר חיובי
export function useGameId() {
  const gameId = Number(useParams().gameId)
  return { gameId, isValid: Number.isInteger(gameId) && gameId > 0 }
}
