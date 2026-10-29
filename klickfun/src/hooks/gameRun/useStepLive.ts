import { useNavigate } from "react-router"
import { useLiveMutation, type LiveAction } from "./useLiveMutation"

type Options = {
  gameId: number
  action: LiveAction
  to?: string
}

// משנה את מצב המשחק בשרת, ואחרי הצלחה עובר לעמוד הבא (אם נשלח נתיב)
export function useStepLive({ gameId, action, to }: Options) {
  const navigate = useNavigate()
  const mutation = useLiveMutation(action)

  const run = () => {
    mutation.mutate(gameId, {
      onSuccess: () => {
        if (to) navigate(to)
      },
    })
  }

  return { run, isPending: mutation.isPending, error: mutation.error }
}
