import { useParams } from "react-router"
import { useLive } from "../../../../hooks/gameRun/useLive"
import { getErrorMessage } from "../../../../utils/getErrorMessage"
import { Connected } from "./Connected"

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
    </>
  )
}

export default Lobby