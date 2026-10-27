import type { Game, GameStatus } from "./game"
import type { Participant } from "./participant"
import type { OptionNumber, Question } from "./question"

// העמודים של הרצת משחק: לובי, ומסך משחק אחד שמשתנה לפי phase
export type PlayPage = "lobby" | "game"

// שורה בטבלת הניקוד
export interface LeaderboardRow {
  rank: number
  participantId: number
  name: string
  score: number
  correctCount: number
  totalCorrectMs: number
}

export interface LiveParticipant extends Pick<Participant, "id" | "name"> {
  connected: boolean
}

// בזמן שאלה התשובה הנכונה לא נשלחת. בחשיפה היא מגיעה (ובסקר היא null)
export interface LiveQuestion extends Pick<Question, "id" | "type" | "text"> {
  options: [string, string, string, string]
  correctOption?: OptionNumber | null
}

export interface RecentAnswer {
  answerId: number
  participantId: number
  name: string
  receivedAt: string
}

export interface FastestAnswer {
  participantId: number
  name: string
  responseMs: number
}

export interface LiveReveal {
  correctOption: OptionNumber | null
  // כמה ענו כל תשובה, לפי הסדר 1-4
  distribution: number[]
  leaderboard: LeaderboardRow[]
}

export interface LiveSummary {
  winners: LeaderboardRow[]
  leaderboard: LeaderboardRow[]
}

// שדות שמגיעים בכל מצב
interface LiveBase {
  serverTime: string
  game: Pick<Game, "id" | "title" | "status">
  totalQuestions: number
  participants: LiveParticipant[]
  connectedCount: number
}

// לפני שהמשחק התחיל. RUNNING/PAUSED מגיעים רק אם השאלה הנוכחית נמחקה
export interface LiveIdleState extends LiveBase {
  phase: Extract<GameStatus, "SETUP" | "LOBBY" | "RUNNING" | "PAUSED">
}

// שדות של סבב שאלה, גם בזמן השאלה וגם בחשיפה
interface LiveRoundBase extends LiveBase {
  paused: boolean
  questionNumber: number
  question: LiveQuestion
  timeLeftMs: number
  isLastQuestion: boolean
  answeredCount: number
  lastAnswerId: number | null
  recentAnswers: RecentAnswer[]
  fastest: FastestAnswer[]
}

export interface LiveQuestionState extends LiveRoundBase {
  phase: "QUESTION"
}

export interface LiveRevealState extends LiveRoundBase {
  phase: "REVEAL"
  reveal: LiveReveal
}

export type LiveRoundState = LiveQuestionState | LiveRevealState

export interface LiveFinishedState extends LiveBase {
  phase: "FINISHED"
  summary: LiveSummary
}

// GET /games/:id/live. לפי phase יודעים אילו שדות הגיעו
export type LiveState = LiveIdleState | LiveRoundState | LiveFinishedState
