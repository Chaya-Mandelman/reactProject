import { useState, type FormEvent } from "react"
import { extractParticipantsApi } from "@/api/ai"
import { addParticipantsBulkApi } from "@/api/participants"
import { useGameMutation } from "@/hooks/games/useGameMutation"
import { getErrorDetails, getErrorMessage } from "@/utils/getErrorMessage"

type Row = { name: string; phone: string; error: string | null; selected: boolean }

type Props = { gameId: number; onClose: () => void }

const MAX_CHARS = 20_000

// הדבקה חכמה: מדביקים רשימה בכל צורה, ה-AI מוציא שמות וטלפונים, בודקים ומתקנים, ושומרים בבת אחת
export function AiParticipants({ gameId, onClose }: Props) {
  const [text, setText] = useState("")
  const [rows, setRows] = useState<Row[] | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState<string | null>(null)
  const save = useGameMutation(addParticipantsBulkApi)

  const extract = async (event: FormEvent) => {
    event.preventDefault()
    setExtractError(null)
    setExtracting(true)
    try {
      const result = await extractParticipantsApi({ gameId, text })
      setRows(result.map((p) => ({ ...p, selected: p.error === null })))
    } catch (error) {
      setExtractError(getErrorMessage(error))
    } finally {
      setExtracting(false)
    }
  }

  // תיקון ידני של שורה: ההודעה הישנה כבר לא רלוונטית, והשרת יבדוק שוב בשמירה
  const updateRow = (index: number, change: Partial<Row>) =>
    setRows((prev) => prev && prev.map((row, i) => (i === index ? { ...row, error: null, ...change } : row)))

  const selected = rows?.map((row, index) => ({ row, index })).filter(({ row }) => row.selected) ?? []

  const saveSelected = async () => {
    try {
      await save.mutateAsync({ gameId, participants: selected.map(({ row }) => ({ name: row.name.trim(), phone: row.phone.trim() })) })
      onClose()
    } catch (error) {
      // השגיאות מהשרת מגיעות לפי המיקום ברשימה שנשלחה (participants.N.field): מחזירים כל אחת לשורה שלה
      const byRow = new Map<number, string>()
      for (const detail of getErrorDetails(error)) {
        const match = /^participants\.(\d+)\./.exec(detail.field)
        const sent = match ? selected[Number(match[1])] : undefined
        if (sent) byRow.set(sent.index, detail.message)
      }
      setRows((prev) => prev && prev.map((row, i) => (byRow.has(i) ? { ...row, error: byRow.get(i) ?? null } : row)))
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-gold/30 bg-bg/50 p-5 text-start">
      <h3 className="mb-2 font-bold text-gold">✨ הדבקה חכמה של משתתפות</h3>
      <p className="mb-4 text-xs text-muted">
        מדביקים רשימה בכל צורה (מאקסל, מוואטסאפ או טקסט חופשי) וה-AI מוציא ממנה שמות וטלפונים. שימי לב: הרשימה נשלחת ל-OpenAI לעיבוד.
      </p>

      <form onSubmit={extract}>
        <fieldset className="flex flex-wrap items-center gap-3" disabled={extracting || save.isPending}>
          <textarea
            className="input h-36 w-full py-3 leading-relaxed"
            placeholder={"לדוגמה:\nשירה כהן 050-1234567\nנועה לוי, 052-7654321"}
            value={text}
            maxLength={MAX_CHARS}
            onChange={(e) => setText(e.target.value)}
          />
          {extractError && <p className="alert w-full" role="alert">{extractError}</p>}
          <button className="btn btn-primary" type="submit" disabled={text.trim().length < 3}>
            {extracting ? "ה-AI קורא את הרשימה..." : rows ? "זיהוי מחדש" : "זיהוי שמות וטלפונים"}
          </button>
          <button className="btn btn-ghost" type="button" onClick={onClose}>ביטול</button>
        </fieldset>
      </form>

      {rows && (
        <div className="mt-6">
          <p className="mb-3 text-sm text-muted">
            {rows.length === 0
              ? "לא נמצאו שמות בטקסט."
              : "בדקי את הרשימה. שורות עם בעיה לא מסומנות: אפשר לתקן אותן ולסמן. השמירה בודקת הכול שוב."}
          </p>
          <ul className="grid gap-2">
            {rows.map((row, i) => (
              <li key={i} className={`flex flex-wrap items-center gap-2 rounded-lg border p-2 ${row.error ? "border-bad/40" : "border-white/10"} ${row.selected ? "" : "opacity-60"}`}>
                <input className="size-4 accent-gold" type="checkbox" aria-label={`לשמור את ${row.name}`} checked={row.selected} onChange={() => setRows((prev) => prev && prev.map((r, n) => (n === i ? { ...r, selected: !r.selected } : r)))} />
                <input className="input h-9 min-w-32 flex-1" aria-label="שם" value={row.name} onChange={(e) => updateRow(i, { name: e.target.value })} />
                <input className="input h-9 min-w-32 flex-1" aria-label="טלפון" type="tel" dir="ltr" value={row.phone} onChange={(e) => updateRow(i, { phone: e.target.value })} />
                {row.error && <span className="field-error block basis-full" role="alert">{row.error}</span>}
              </li>
            ))}
          </ul>
          {save.error && <p className="alert mt-4" role="alert">{getErrorMessage(save.error)}</p>}
          {rows.length > 0 && (
            <button className="btn btn-gold mt-4" type="button" disabled={selected.length === 0 || save.isPending} onClick={saveSelected}>
              {save.isPending ? "שומר..." : `שמירת ${selected.length} משתתפות`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
