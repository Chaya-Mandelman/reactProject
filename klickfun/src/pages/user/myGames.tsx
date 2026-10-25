import { useAuth } from "../../context/user"
function MyGames() {

  const { user } = useAuth()
  return (
    <>
      <div> {user?.name }שם:</div>
      <div>המשחקים שלי</div>
    </>
  )
}

export default MyGames
