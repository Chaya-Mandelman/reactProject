import { useNavigate } from "react-router"
import type { LiveState } from "../../types/liveState"
import { useLiveMutation } from "./useLiveMutation"

export type PlayPage = "lobby" | "question" | "reveal" | "summary"

// משנה את מצב המשחק בשרת, ואחרי הצלחה עובר לעמוד הבא של ההרצה
export const useStepLive = ({ gameId, funcApi, namePage }: { gameId: number, funcApi: (id: number) => Promise<LiveState>, namePage: PlayPage }) => {
    const navigate = useNavigate()
    const mutation = useLiveMutation(funcApi)

    const run = () => {
        mutation.mutate(gameId, { onSuccess: () => navigate(`/play/${gameId}/${namePage}`) })
    }

    return { run, isPending: mutation.isPending, error: mutation.error }
}
