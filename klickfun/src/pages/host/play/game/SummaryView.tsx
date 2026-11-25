import { useEffect, useState, type CSSProperties } from "react"
import { Link } from "react-router"
import { openLobbyApi } from "@/api/gameRun"
import { LiveStepButton } from "@/components/LiveStepButton"
import { paths } from "@/constants/routes"
import type { LiveFinishedState } from "@/types/liveState"
import { sfx } from "@/utils/sfx"
import { Leaderboard } from "./Leaderboard"
import styles from "./Wow.module.css"

const MEDALS = ["🥇", "🥈", "🥉"]

// שלבי ההצגה: 0 מתח, 1 מקום שלישי, 2 מקום שני, 3 המנצחת, 4 כל השאר
type Step = 0 | 1 | 2 | 3 | 4
// מתי (במילישניות מתחילת המסך) מתחיל כל שלב
const TIMELINE: [Step, number][] = [[1, 2200], [2, 3500], [3, 6300], [4, 7600]]
// לפני המנצחת: עוד תיפוף
const WINNER_DRUMROLL_AT = 4500

// באיזה שלב נחשף כל מקום (המקום הראשון אחרון)
const shownAt = (index: number): Step => (index === 0 ? 3 : index === 1 ? 2 : 1)

// "שחק שוב" פותח לובי חדש: השרת מאפס את התשובות והניקוד
export function SummaryView({ live, muted }: { live: LiveFinishedState; muted: boolean }) {
  const { winners, leaderboard } = live.summary
  const hasWinner = winners.length > 0 && (winners[0]?.score ?? 0) > 0
  const [step, setStep] = useState<Step>(hasWinner ? 0 : 4)

  useEffect(() => {
    if (!hasWinner) return
    const sound = (play: () => void) => () => !muted && play()
    const timers = [
      setTimeout(sound(() => sfx.drumroll(2000)), 0),
      setTimeout(sound(() => sfx.drumroll(1700)), WINNER_DRUMROLL_AT),
      ...TIMELINE.map(([next, at]) =>
        setTimeout(() => {
          setStep((current) => (current < next ? next : current))
          if (next === 3) sound(() => sfx.fanfare())()
          else if (next < 3 && winners.length > 3 - next) sound(() => sfx.rise())()
        }, at),
      ),
    ]
    return () => timers.forEach(clearTimeout)
    // רק פעם אחת, כשהמסך נפתח
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const show = (from: Step, enter = styles.appear) => (step >= from ? enter : styles.hidden)

  return (
    <section className="relative isolate mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
      {step === 0 && (
        <div className={styles.suspense} role="status" aria-live="assertive">
          <p className={styles.suspenseSub}>🏁 המשחק הסתיים!</p>
          <p className={`${styles.suspenseTitle} ${styles.dots}`}>ומי ניצחה</p>
        </div>
      )}
      {step < 4 && hasWinner && (
        <button className={`btn btn-ghost ${styles.skip}`} type="button" onClick={() => setStep(4)}>דילוג ▸</button>
      )}
      {step >= 3 && <Confetti />}

      <img className={`pointer-events-none absolute inset-x-0 -top-8 -z-10 w-full opacity-70 ${show(3)}`} src="/confetti.svg" alt="" aria-hidden="true" />
      <div className={`cta flex flex-wrap items-center justify-center gap-3 ${show(4)}`}>
        <LiveStepButton gameId={live.game.id} action={openLobbyApi} to={paths.play(live.game.id, "lobby")} label="שחק שוב" />
        <Link className="btn btn-ghost h-14 px-8" to={paths.myGames}>חזרה למשחקים שלי</Link>
      </div>
      <img className={`size-24 drop-shadow-[0_0_30px_rgb(247_201_72/0.6)] sm:size-32 ${show(3)}`} src="/trophy.svg" alt="" aria-hidden="true" />

      <h2 className={`gold-text -mt-4 text-5xl sm:text-6xl ${show(1)}`}>המנצחים</h2>
      <ol className="flex w-full flex-wrap items-end justify-center gap-5">
        {winners.map((winner, i) => (
          <li
            className={`frame-panel min-w-44 px-7 pt-7 pb-9 text-lg font-black break-words text-white tabular-nums first:order-2 first:pt-10 first:pb-16 first:text-2xl first:text-gold first:drop-shadow-[0_0_30px_rgb(247_201_72/0.45)] [&:nth-child(2)]:order-1 [&:nth-child(2)]:pb-12 [&:nth-child(3)]:order-3 ${show(shownAt(i), i === 0 ? styles.podiumWinner : styles.podiumIn)}`}
            key={winner.participantId}
          >
            {MEDALS[i]} {winner.name} · {winner.score} נקודות
          </li>
        ))}
      </ol>
      <h2 className={`section-title mt-4 mb-0 text-2xl ${show(4)}`}>טבלת הניקוד</h2>
      <div className={`w-full ${show(4)}`}>
        <Leaderboard rows={leaderboard} />
      </div>
    </section>
  )
}

const COLORS = ["#f7c948", "#3fd0ff", "#38e27a", "#ff4d5e", "#ffffff", "#b388ff"]

// גשם קונפטי. המיקומים "אקראיים" אבל קבועים לפי המספר של כל חתיכה
function Confetti() {
  return (
    <div className={styles.confetti} aria-hidden="true">
      {Array.from({ length: 90 }, (_, i) => {
        const r = (n: number) => ((i * 9301 + n * 49297) % 233280) / 233280
        const style = {
          "--x": `${r(1) * 100}%`,
          "--size": `${8 + r(2) * 10}px`,
          "--color": COLORS[i % COLORS.length],
          "--delay": `${r(3) * 2.5}s`,
          "--fall": `${2.8 + r(4) * 2.5}s`,
          "--spin": `${360 + r(5) * 900}deg`,
          "--drift": `${(r(6) - 0.5) * 30}vw`,
        } as CSSProperties
        return <span key={i} className={styles.piece} style={style} />
      })}
    </div>
  )
}
