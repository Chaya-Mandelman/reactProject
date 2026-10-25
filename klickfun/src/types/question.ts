export type QuestionType = "COMPETITIVE"

export type OptionNumber = 1 | 2 | 3 | 4

export interface Question {
    "id": number,
    "order": number,
    "type": QuestionType,
    "text": string,
    "option1": string,
    "option2": string,
    "option3": string,
    "option4": string,
    "correctOption": OptionNumber
}
