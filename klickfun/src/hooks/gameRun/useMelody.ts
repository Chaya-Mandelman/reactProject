import { useEffect } from "react"
import { playNote } from "@/utils/audio"

// דו מי סול מי רה פה לה פה
const NOTES = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46]
const NOTE_MS = 300
const URGENT_NOTE_MS = 150

// מנגינה שחוזרת בלולאה כל עוד playing. ב-urgent היא מתנגנת מהר פי שניים.
// נבנית בדפדפן עם Web Audio, בלי קובץ שמע
export function useMelody(playing: boolean, urgent: boolean) {
  useEffect(() => {
    if (!playing) return

    const context = new AudioContext()
    // אחרי רענון הדפדפן משתיק עד לחיצה ראשונה בעמוד
    const resume = () => context.resume()
    document.addEventListener("pointerdown", resume, { once: true })

    const noteMs = urgent ? URGENT_NOTE_MS : NOTE_MS
    let step = 0
    const timer = setInterval(() => {
      playNote(context, NOTES[step % NOTES.length], noteMs)
      step++
    }, noteMs)

    return () => {
      clearInterval(timer)
      document.removeEventListener("pointerdown", resume)
      context.close()
    }
  }, [playing, urgent])
}
