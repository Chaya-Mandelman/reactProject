import { useAuth } from "../../context/user"

function EditGame() {
  const { user } = useAuth()
  return (
    <>
      <div> {user?.name} שם:</div>
      <div>עריכת משחק</div>
    </>
  )
}

export default EditGame
