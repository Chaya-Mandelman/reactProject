import { Link } from "react-router"
import type { LiveAction } from "@/hooks/gameRun/useLiveMutation"
import { LiveStepButton } from "./LiveStepButton"

type NavTarget = { to: string; label: string }
// חזרה שקודם משנה את מצב המשחק בשרת (למשל סגירת הלובי)
type BackTarget = NavTarget & { live?: { gameId: number; action: LiveAction } }

type Props = {
  back: BackTarget
  forward?: NavTarget
}

const BACK = "btn btn-ghost text-white before:text-lg before:content-['→']"

// שורת ניווט קבועה בראש הדף: כפתור חזרה בולט, ואם יש לאן להמשיך גם כפתור קדימה
export function PageNav({ back, forward }: Props) {
  return (
    <nav className="mt-6 mb-2 flex w-full flex-wrap items-center justify-between gap-3">
      {back.live
        ? <LiveStepButton {...back.live} to={back.to} label={back.label} className={BACK} />
        : <Link className={BACK} to={back.to}>{back.label}</Link>}
      {forward && <Link className="btn btn-gold after:text-lg after:content-['←']" to={forward.to}>{forward.label}</Link>}
    </nav>
  )
}
