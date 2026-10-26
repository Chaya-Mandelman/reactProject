// מנגן תו אחד: צליל רך שדועך, כדי שלא ייחתך בחדות
export function playNote(context: AudioContext, frequency: number, durationMs: number) {
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const end = context.currentTime + durationMs / 1000

  oscillator.type = "triangle"
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0.15, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, end)

  oscillator.connect(gain).connect(context.destination)
  oscillator.start()
  oscillator.stop(end)
}
