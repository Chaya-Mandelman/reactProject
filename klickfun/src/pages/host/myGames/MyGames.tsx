import { useGamesFilters } from "@/hooks/games/useGamesFilters"
import { OpenButton } from "@/components/OpenButton"
import { GamesFilterBar } from "@/components/GamesFilterBar"
import { AddGame } from "./AddGame"
import { GamesList } from "./GamesList"

function MyGames() {
  const { filters, updateFilters } = useGamesFilters()

  return (
    <>
      <h1 className="page-title">המשחקים שלי</h1>
      <div className="mb-6 flex justify-center">
        <OpenButton label="יצירת משחק חדש">{(close) => <AddGame onClose={close} />}</OpenButton>
      </div>
      <div className="toolbar mb-8 flex flex-wrap items-center justify-between gap-3">
        <GamesFilterBar filters={filters} onChange={updateFilters} />
      </div>
      <GamesList filters={filters} />
    </>
  )
}

export default MyGames
