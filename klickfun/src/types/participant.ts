export interface Participant {
  id: number
  name: string
  phone: string
}

// מה שנשלח בהוספה ובעריכה
export type ParticipantInput = Omit<Participant, "id">
