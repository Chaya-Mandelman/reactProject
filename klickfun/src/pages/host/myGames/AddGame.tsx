import { useNavigate } from "react-router"
import { GameForm } from "@/components/GameForm"
import { paths } from "@/constants/routes"
import { useAddGame } from "@/hooks/games/useGameMutations"

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
        navigate(paths.editGame(game.id))
      }}
    />
  )
}
