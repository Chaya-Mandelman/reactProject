// אפקטים קוליים למסך המשחק: נבנים בדפדפן עם Web Audio, בלי קבצי שמע

let shared: AudioContext | null = null

// הקשר שמע אחד לכל האפקטים. אחרי רענון הדפדפן משתיק עד לחיצה ראשונה בעמוד
function audio(): AudioContext | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null
  if (!shared) {
    shared = new AudioContext()
    document.addEventListener("pointerdown", () => shared?.resume(), { once: true })
  }
  return shared
}

function tone(ctx: AudioContext, frequency: number, startIn: number, durationMs: number, type: OscillatorType = "triangle", volume = 0.18) {
  const start = ctx.currentTime + startIn
  const end = start + durationMs / 1000
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, end)
  oscillator.connect(gain).connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(end + 0.02)
}

let noise: AudioBuffer | null = null
function noiseBuffer(ctx: AudioContext) {
  if (!noise) {
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  return noise
}

// פרץ רעש קצר: מכת תוף (תדר נמוך) או מצלה (תדר גבוה)
function hit(ctx: AudioContext, startIn: number, durationMs: number, volume: number, filter: BiquadFilterType, frequency: number) {
  const start = ctx.currentTime + startIn
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer(ctx)
  const band = ctx.createBiquadFilter()
  band.type = filter
  band.frequency.value = frequency
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(volume, start)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + durationMs / 1000)
  source.connect(band).connect(gain).connect(ctx.destination)
  source.start(start)
  source.stop(start + durationMs / 1000 + 0.05)
}

export const sfx = {
  // טיק של שעון. בשלוש השניות האחרונות גבוה יותר
  tick(urgent: boolean) {
    const ctx = audio()
    if (ctx) tone(ctx, urgent ? 1320 : 990, 0, 90, "square", 0.08)
  },

  // תיפוף שמתגבר, ומכת מצלה בסוף
  drumroll(durationMs: number) {
    const ctx = audio()
    if (!ctx) return
    const beats = Math.floor(durationMs / 55)
    for (let i = 0; i < beats; i++) {
      hit(ctx, i * 0.055, 70, 0.08 + (0.28 * i) / beats, "lowpass", 900)
    }
    hit(ctx, durationMs / 1000, 1200, 0.35, "highpass", 5000)
  },

  // "דינג" של תשובה נכונה
  ding() {
    const ctx = audio()
    if (!ctx) return
    tone(ctx, 1046.5, 0, 260)
    tone(ctx, 1568, 0.12, 500)
  },

  // צליל עולה כשמישהי עולה לפודיום
  rise() {
    const ctx = audio()
    if (!ctx) return
    ;[523.25, 659.25, 783.99].forEach((f, i) => tone(ctx, f, i * 0.07, 180))
  },

  // תרועת ניצחון
  fanfare() {
    const ctx = audio()
    if (!ctx) return
    const notes: [number, number, number][] = [
      [523.25, 0, 160],
      [523.25, 0.17, 160],
      [523.25, 0.34, 160],
      [659.25, 0.51, 420],
      [783.99, 0.95, 220],
      [1046.5, 1.18, 900],
    ]
    for (const [f, at, ms] of notes) {
      tone(ctx, f, at, ms, "sawtooth", 0.07)
      tone(ctx, f / 2, at, ms, "triangle", 0.12)
    }
    hit(ctx, 1.18, 1400, 0.3, "highpass", 5000)
  },
}
