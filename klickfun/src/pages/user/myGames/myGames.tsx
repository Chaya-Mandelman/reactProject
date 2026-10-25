import { useState } from "react"
import { useMyGames } from "../../../hooks/games/usegetgames"
import type { GamesFilters, GamesSort, GameStatus } from "../../../types/game"
import { SortGames } from "./sort"
import { AddGame } from "./addgame"
import { Link, useSearchParams } from "react-router"
import { useDeleteGame, useDuplicateGame } from "../../../hooks/games/useDeleteGame"
import { getErrorMessage } from "../../../function/getErrorMessage"



function MyGames() {

  // הפילטרים נשמרים בכתובת, כך שהם נשארים אחרי רענון או חזרה מדף אחר
  const [searchParams, setSearchParams] = useSearchParams()
  const filters: GamesFilters = {
    search: searchParams.get("search") ?? undefined,
    status: (searchParams.get("status") as GameStatus | null) ?? undefined,
    sort: (searchParams.get("sort") as GamesSort | null) ?? undefined,
  }
  const updateFilters = (changes: GamesFilters) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
      return next
    }, { replace: true })
  }

  const { data: games = [], isLoading, error } = useMyGames(filters)
  const deleteGame = useDeleteGame()
  const duplicateGame = useDuplicateGame()
  const onClickDeleteGame = (id: number) => {
    deleteGame.mutate(id)
  }

  const onClickDuplicateGame = (id: number) => {
    duplicateGame.mutate(id)
  }




  const [showAdd, setShowAdd] = useState(false)

  return (
    <>
      <div>המשחקים שלי</div>
      <button onClick={() => setShowAdd(true)}>יצירת משחק חדש</button>
      {showAdd && <AddGame setShowAdd={setShowAdd} />}


      <SortGames filters={filters} onChange={updateFilters} />

      {isLoading && <div>טוען משחקים...</div>}
      {error && <div role="alert">{getErrorMessage(error)}</div>}
      {deleteGame.isError && <div role="alert">{getErrorMessage(deleteGame.error)}</div>}
      {duplicateGame.isError && <div role="alert">{getErrorMessage(duplicateGame.error)}</div>}
      {!isLoading && !error && games.length === 0 && <div>לא נמצאו משחקים</div>}
      {!isLoading && !error && (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              <Link to={`/games/${game.id}`}>צפייה במשחק</Link>
              <Link to={`/games/edit/${game.id}`}>עריכת המשחק</Link>
              <Link to={`/games/${game.id}/questions`}>ניהול שאלות</Link>
              <Link to={`/games/${game.id}/participants`}>ניהול משתתפים</Link>
              <Link to={`/games/${game.id}/results`}>תוצאות המשחק</Link>
              <button
                onClick={() => onClickDuplicateGame(game.id)}
                disabled={duplicateGame.isPending && duplicateGame.variables === game.id}
              >
                {duplicateGame.isPending && duplicateGame.variables === game.id ? "משכפל..." : "שכפול משחק"}
              </button>
              <button
                onClick={() => onClickDeleteGame(game.id)}
                disabled={deleteGame.isPending && deleteGame.variables === game.id}
              >
                {deleteGame.isPending && deleteGame.variables === game.id ? "מוחק משחק..." : "מחיקת משחק"}
              </button>
              <div>{game.title} שם המשחק:</div>
              <div>{game.status}מצב: </div>
              <div>{game.description}תיאור: </div>
              <div>{game.participantsCount}כמות משתתפים: </div>
              <div>{game.questionsCount}כמות שאלות: </div>
            </li>
          ))}
        </ul>
      )}



    </>
  )
}

export default MyGames
