import type { Game, GamePhase } from "./game"
import type { Participant } from "./participant"
import type { OptionNumber, Question } from "./question"

// שורה בטבלת הניקוד
export interface LeaderboardRow {
    "rank": number,
    "participantId": number,
    "name": string,
    "score": number,
    "correctCount": number,
    "totalCorrectMs": number
}

export interface LiveParticipant extends Pick<Participant, "id" | "name"> {
    "connected": boolean
}

// בזמן שאלה התשובה הנכונה לא נשלחת
export interface LiveQuestion extends Pick<Question, "id" | "type" | "text"> {
    "options": [string, string, string, string]
}

export interface RecentAnswer {
    "answerId": number,
    "participantId"?: number,
    "name": string,
    "receivedAt": string
}

export interface FastestAnswer {
    "participantId"?: number,
    "name": string,
    "responseMs": number
}

// מגיע רק בשלב REVEAL
export interface LiveReveal {
    "correctOption": OptionNumber,
    "distribution": number[]
}

// מגיע רק כשהמשחק FINISHED
export interface LiveSummary {
    "winners": LeaderboardRow[]
}

// GET /live
export interface LiveState {
    "serverTime"?: string,
    "game": Pick<Game, "id" | "title" | "status">,
    "totalQuestions": number,
    "participants": LiveParticipant[],
    "connectedCount": number,
    "phase": GamePhase | null,
    "paused": boolean,
    "questionNumber": number | null,
    "question": LiveQuestion | null,
    "timeLeftMs": number | null,
    "revealLeftMs"?: number | null,
    "isLastQuestion"?: boolean,
    "answeredCount": number,
    "lastAnswerId": number | null,
    "recentAnswers": RecentAnswer[],
    "fastest": FastestAnswer[],
    "reveal"?: LiveReveal,
    "summary"?: LiveSummary,
    "leaderboard"?: LeaderboardRow[]
}
