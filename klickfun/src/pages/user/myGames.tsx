import { useAuthStore } from "../../store/authStore"
function MyGames() {

  const user = useAuthStore((state) => state.user)
  return (
    <>
      <div> {user?.name }שם:</div>
      <div>המשחקים שלי</div>
    </>
  )
}

export default MyGames
