import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import { getErrorMessage, setFieldErrors } from "../../../function/getErrorMessage"
import { useAddGame } from "../../../hooks/games/useAddGame"
import type { CreateGame } from "../../../types/game"
import type { Dispatch, SetStateAction } from "react"

export const addGameSchema = z.object({
    title: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
})

export function AddGame({ setShowAdd }: { setShowAdd: Dispatch<SetStateAction<boolean>> }) {
    const addGame = useAddGame()
    const navigate = useNavigate()

    const {
        register, handleSubmit, setError, formState: { errors, isValid },
    } = useForm<CreateGame>({
        resolver: zodResolver(addGameSchema),
        mode: "onChange",
        defaultValues: { title: "", description: "" },
    })

    const onSubmit = (data: CreateGame) => {
        addGame.mutate(data, {
            onSuccess: (game) => {
                navigate(`/games/edit/${game.id}`)
            },
            onError: (error) => {
                setFieldErrors(error, setError, ["title", "description"])
            },

        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="title">שם המשחק:</label>
                <input id="title" {...register("title")} />
                {errors.title && <span>{errors.title.message}</span>}
            </div>
            <div>
                <label htmlFor="description">תיאור:</label>
                <textarea id="description" {...register("description")} />
                {errors.description && <span>{errors.description.message}</span>}
            </div>
            {addGame.isError && <p role="alert">{getErrorMessage(addGame.error)}</p>}
            <button type="submit" disabled={!isValid || addGame.isPending}>
                {addGame.isPending ? "נוצר..." : "יצירת משחק"}
            </button>
            <button type="button" onClick={() => setShowAdd(false)}>ביטול</button>
        </form>
    )
}

