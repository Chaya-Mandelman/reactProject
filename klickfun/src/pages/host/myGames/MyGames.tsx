import { useGamesFilters } from "@/hooks/games/useGamesFilters"
import { OpenButton } from "@/components/OpenButton"
import { GamesFilterBar } from "./GamesFilterBar"
import { AddGame } from "./AddGame"
import { GamesList } from "./GamesList"

function MyGames() {
  const { filters, updateFilters } = useGamesFilters()

  return (
    <>
      <h1 className="mx-auto w-[calc(100%-2rem)] max-w-5xl mt-10 mb-8 text-center text-4xl font-black tracking-tight md:text-5xl bg-linear-to-b from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(251,191,36,0.55)]">המשחקים שלי</h1>
      <OpenButton label="יצירת משחק חדש">{(close) => <AddGame onClose={close} />}</OpenButton>
      <GamesFilterBar filters={filters} onChange={updateFilters} />
      <GamesList filters={filters} />
    </>
  )
}

export default MyGames
