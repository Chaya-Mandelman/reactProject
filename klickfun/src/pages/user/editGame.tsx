import { useAuthStore } from "../../store/authStore"

function EditGame() {
  const user = useAuthStore((state) => state.user)
  return (
    <>
      <div> {user?.name} שם:</div>
      <div>עריכת משחק</div>
    </>
  )
}

export default EditGame
