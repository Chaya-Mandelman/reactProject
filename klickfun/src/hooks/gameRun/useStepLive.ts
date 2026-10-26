import { useNavigate } from "react-router"
import { paths } from "@/constants/routes"
import type { PlayPage } from "@/types/liveState"
import { useLiveMutation, type LiveAction } from "./useLiveMutation"

type Options = {
  gameId: number
  action: LiveAction
  nextPage?: PlayPage
}

// משנה את מצב המשחק בשרת, ואחרי הצלחה עובר לעמוד הבא של ההרצה (אם נשלח עמוד)
export function useStepLive({ gameId, action, nextPage }: Options) {
  const navigate = useNavigate()
  const mutation = useLiveMutation(action)

  const run = () => {
    mutation.mutate(gameId, {
      onSuccess: () => {
        if (nextPage) navigate(paths.play(gameId, nextPage))
      },
    })
  }

  return { run, isPending: mutation.isPending, error: mutation.error }
}
