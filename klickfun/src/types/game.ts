import type { Question } from "./question"
import type { Participant } from "./participant"
import type User from "./user"

export type GameStatus = "SETUP" | "LOBBY" | "RUNNING" | "PAUSED" | "FINISHED"

export type GamePhase = "QUESTION" | "REVEAL"

export type GameHost = Pick<User, "id" | "name">

export interface Game {
  "id": number,
  "hostId": number,
  "title": string,
  "description"?: string | null,
  "status": GameStatus,
  "currentQuestionIndex"?: number | null,
  "phase"?: GamePhase | null,
  "phaseStartedAt"?: string | null,
  "pausedElapsedMs"?: number | null,
  "startedAt"?: string | null,
  "finishedAt"?: string | null,
  "createdAt": string,
  "updatedAt": string
}

// שורה ברשימת המשחקים
export interface GameSummary {
  "id": number,
  "title": string,
  "description": string | null,
  "status": GameStatus,
  "host": GameHost,
  "questionsCount": number,
  "participantsCount": number
}

// משחק מלא
export interface GameDetails {
  "id": number,
  "title": string,
  "description": string | null,
  "status": GameStatus,
  "host": GameHost,
  "questions": Question[],
  "participants": Participant[]
}
