import { Link } from "react-router"

export function GameLinks({ gameId }: { gameId: number }) {
  return (
    <nav>
      <Link to={`/games/${gameId}`}>צפייה במשחק</Link>
      <Link to={`/games/edit/${gameId}`}>עריכת המשחק</Link>
      <Link to={`/games/${gameId}/questions`}>ניהול שאלות</Link>
      <Link to={`/games/${gameId}/participants`}>ניהול משתתפים</Link>
      <Link to={`/games/${gameId}/results`}>תוצאות המשחק</Link>
    </nav>
  )
}
