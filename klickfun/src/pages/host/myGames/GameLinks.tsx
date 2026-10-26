import { Link } from "react-router"

export function GameLinks({ gameId }: { gameId: number }) {
  return (
    <nav>
      <Link to={`/play/${gameId}/lobby`}>התחלת משחק</Link>
      <Link to={`/games/edit/${gameId}`}>עריכת המשחק</Link>
    </nav>
  )
}
