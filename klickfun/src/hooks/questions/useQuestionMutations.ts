import { addQuestionApi, applyImageChange, deleteQuestionApi, updateQuestionApi } from "@/api/questions"
import { useGameMutation } from "@/hooks/games/useGameMutation"
import type { ImageChange, QuestionInput } from "@/types/question"
import { getErrorMessage } from "@/utils/getErrorMessage"

type SaveVariables = { gameId: number; id?: number; details: QuestionInput; image: ImageChange }

// שמירת שאלה ואז התמונה שלה. אם רק התמונה נכשלה, השאלה כבר נשמרה:
// לא זורקים שגיאה (כדי שלחיצה חוזרת לא תיצור שאלה כפולה), אלא מחזירים הודעה להצגה
async function saveQuestion({ gameId, id, details, image }: SaveVariables) {
  const question = id ? await updateQuestionApi({ gameId, id, details }) : await addQuestionApi({ gameId, details })
  try {
    await applyImageChange({ gameId, id: question.id }, image)
    return { question, imageError: null }
  } catch (error) {
    return { question, imageError: `השאלה נשמרה, אבל שמירת התמונה נכשלה: ${getErrorMessage(error)}` }
  }
}

export const useSaveQuestion = () => useGameMutation(saveQuestion)
export const useDeleteQuestion = () => useGameMutation(deleteQuestionApi)
