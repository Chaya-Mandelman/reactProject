import { useState } from "react"
import { useMyGames } from "../../../hooks/games/usegetgames"
import { type GamesFilters} from "../../../types/game"
import {SortGames} from "./sort"
import { AddGame } from "./addgame"



function MyGames() {

  const [filters, setFilters] = useState<GamesFilters>({})
  const { data: games = [], isLoading, error } = useMyGames(filters)

  

  const [showAdd, setShowAdd] = useState(false)

return (
  <>
  <div>המשחקים שלי</div>
    <button onClick={() => setShowAdd(true)}>יצירת משחק חדש</button>
    {showAdd && <AddGame setShowAdd={setShowAdd} />}

     <SortGames filters={filters} setFilters={setFilters} />

      {isLoading && <div>טוען משחקים...</div>}
      {error && <div>שגיאה בטעינת המשחקים</div>}
      {!isLoading && !error && (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
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
