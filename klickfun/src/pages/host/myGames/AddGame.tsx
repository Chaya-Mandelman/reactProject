import { useNavigate } from "react-router"
import { useAddGame } from "../../../hooks/games/useGameMutations"
import { GameForm } from "../../../components/GameForm"

export function AddGame({ onClose }: { onClose: () => void }) {
  const addGame = useAddGame()
  const navigate = useNavigate()

  return (
    <GameForm
      defaultValues={{ title: "", description: "" }}
      submitLabel="יצירת משחק"
      onCancel={onClose}
      onSubmit={async (data) => {
        const game = await addGame.mutateAsync(data)
        navigate(`/games/edit/${game.id}`)
      }}
    />
  )
}
