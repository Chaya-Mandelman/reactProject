import { useParams } from "react-router"
import { useLive } from "../../../../hooks/gameRun/useLive"
import { getErrorMessage } from "../../../../utils/getErrorMessage"
import { Connected } from "./Connected"
import { LiveStepButton } from "../../../../components/LiveStepButton"
import { startGameApi } from "../../../../api/gameRun"

function Lobby() {
  const { gameId } = useParams()
  const gameIdn = Number(gameId)
  const isValidId = !Number.isNaN(gameIdn)

  const { data, isPending, isError, error } = useLive(gameIdn, isValidId)

  if (!isValidId) return <p>מזהה משחק לא תקין</p>

  return (
    <>
      {isPending && <p>טוען משתמשים מחוברים...</p>}
      {isError && <p>{getErrorMessage(error)}</p>}
      {data && <Connected live={data} />}
      <LiveStepButton gameId={gameIdn} funcApi={startGameApi} namePage="question" label="התחל משחק" />
    </>
  )
}

export default Lobby
