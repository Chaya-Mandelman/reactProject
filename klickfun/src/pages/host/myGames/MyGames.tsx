import { useGamesFilters } from "../../../hooks/games/useGamesFilters"
import { OpenButton } from "../../../components/OpenButton"
import { GamesFilterBar } from "./GamesFilterBar"
import { AddGame } from "./AddGame"
import { GamesList } from "./GamesList"

function MyGames() {
  const { filters, updateFilters } = useGamesFilters()

  return (
    <>
      <h1>המשחקים שלי</h1>
      <OpenButton label="יצירת משחק חדש">{(close) => <AddGame onClose={close} />}</OpenButton>
      <GamesFilterBar filters={filters} onChange={updateFilters} />
      <GamesList filters={filters} />
    </>
  )
}

export default MyGames
