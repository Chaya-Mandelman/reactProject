-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'HOST');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('SETUP', 'LOBBY', 'RUNNING', 'PAUSED', 'FINISHED');

-- CreateEnum
CREATE TYPE "GamePhase" AS ENUM ('QUESTION', 'REVEAL');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('COMPETITIVE', 'POLL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'HOST',
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "hostId" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "status" "GameStatus" NOT NULL DEFAULT 'SETUP',
    "currentQuestionIndex" INTEGER,
    "phase" "GamePhase",
    "phaseStartedAt" TIMESTAMP(3),
    "pausedElapsedMs" INTEGER,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "connectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'COMPETITIVE',
    "text" VARCHAR(300) NOT NULL,
    "option1" VARCHAR(120) NOT NULL,
    "option2" VARCHAR(120) NOT NULL,
    "option3" VARCHAR(120) NOT NULL,
    "option4" VARCHAR(120) NOT NULL,
    "correctOption" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "participantId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "choice" INTEGER NOT NULL,
    "responseMs" INTEGER NOT NULL,
    "isCorrect" BOOLEAN,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Game_hostId_idx" ON "Game"("hostId");

-- CreateIndex
CREATE INDEX "Game_status_idx" ON "Game"("status");

-- CreateIndex
CREATE INDEX "Participant_phone_idx" ON "Participant"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_gameId_phone_key" ON "Participant"("gameId", "phone");

-- CreateIndex
CREATE INDEX "Question_gameId_order_idx" ON "Question"("gameId", "order");

-- CreateIndex
CREATE INDEX "Answer_questionId_createdAt_idx" ON "Answer"("questionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_participantId_questionId_key" ON "Answer"("participantId", "questionId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ===== אילוצי תקינות נוספים (שכבת הגנה במסד הנתונים) =====

-- תשובה חייבת להיות מקש 1 עד 4
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_choice_range" CHECK ("choice" BETWEEN 1 AND 4);

-- זמן תשובה לא שלילי
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_responseMs_nonneg" CHECK ("responseMs" >= 0);

-- בשאלה תחרותית חייבת להיות תשובה נכונה 1..4, ובסקר אסור שתהיה
ALTER TABLE "Question" ADD CONSTRAINT "Question_correct_by_type" CHECK (
  ("type" = 'COMPETITIVE' AND "correctOption" BETWEEN 1 AND 4)
  OR ("type" = 'POLL' AND "correctOption" IS NULL)
);
