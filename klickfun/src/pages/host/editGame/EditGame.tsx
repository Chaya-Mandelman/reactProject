import { useSearchParams } from "react-router"
import { GameForm } from "@/components/GameForm"
import { PageNav } from "@/components/PageNav"
import { isActiveStatus } from "@/constants/game"
import { getLivePath, paths } from "@/constants/routes"
import { useGame } from "@/hooks/games/useGame"
import { useUpdateGame } from "@/hooks/games/useGameMutations"
import { useGameId } from "@/hooks/useGameId"
import type { GameDetails } from "@/types/game"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { Participants } from "./Participants"
import { Questions } from "./Questions"

// הלשוניות של עמוד העריכה. הלשונית שנבחרה נשמרת בכתובת (?tab=), כך שרענון לא מחזיר להתחלה
const TABS = ["details", "participants", "questions"] as const
type Tab = (typeof TABS)[number]
const isTab = (value: string | null): value is Tab => TABS.includes(value as Tab)

function EditGame() {
  const { gameId, isValid } = useGameId()
  const { data: game, isLoading, error } = useGame(gameId, isValid)
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get("tab")
  const tab: Tab = isTab(tabParam) ? tabParam : "details"
  // replace: מעבר בין לשוניות לא ממלא את ההיסטוריה, וכפתור "חזרה" יוצא מהעמוד
  const selectTab = (next: Tab) => setSearchParams({ tab: next }, { replace: true })

  if (!isValid) return <div className="alert mt-10" role="alert">מזהה משחק לא תקין</div>
  if (isLoading) return <div className="status">טוען משחק...</div>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הטופס על המסך
  if (!game) return <div className="alert mt-10" role="alert">{getErrorMessage(error)}</div>

  // משחק פעיל נעול: השרת מחזיר 409 על כל עריכה
  const locked = isActiveStatus(game.status)

  return (
    <>
      <PageNav
        back={{ to: paths.myGames, label: "חזרה למשחקים שלי" }}
        forward={locked ? { to: getLivePath(game.id, game.status), label: "חזרה למשחק הפעיל" } : undefined}
      />
      <h1 className="page-title mt-4">עריכת משחק</h1>
      {error && <div className="alert mb-6" role="alert">{getErrorMessage(error)}</div>}
      {locked && <p className="alert-warn mb-6" role="alert">המשחק פעיל כרגע, ולכן אי אפשר לערוך אותו</p>}
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="חלקי המשחק">
        {TABS.map((value) => (
          <button
            key={value}
            id={`tab-${value}`}
            className={`toggle ${tab === value ? "border-gold bg-gold/10 text-gold" : ""}`}
            role="tab"
            type="button"
            aria-selected={tab === value}
            aria-controls="edit-tab-panel"
            onClick={() => selectTab(value)}
          >
            {value === "details" && "פרטי משחק"}
            {value === "participants" && `משתתפים (${game.participants.length})`}
            {value === "questions" && `שאלות (${game.questions.length})`}
          </button>
        ))}
      </div>
      <div id="edit-tab-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === "details" && <GameDetailsForm game={game} locked={locked} />}
        {tab === "participants" && <Participants game={game} locked={locked} />}
        {tab === "questions" && <Questions game={game} locked={locked} />}
      </div>
    </>
  )
}

function GameDetailsForm({ game, locked }: { game: GameDetails; locked: boolean }) {
  const updateGame = useUpdateGame()

  return (
    <section className="card">
      <h2 className="section-title">פרטי משחק</h2>
      <GameForm
        defaultValues={{ title: game.title, description: game.description ?? "" }}
        submitLabel="שמירה"
        disabled={locked}
        onSubmit={(details) => updateGame.mutateAsync({ id: game.id, details })}
      />
    </section>
  )
}

export default EditGame
