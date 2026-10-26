// שניות שנותרו, מעוגל למעלה: 4.2 שניות מוצגות כ-5
export const toSecondsLeft = (ms: number) => Math.ceil(ms / 1000)

// זמן תגובה עם עשירית שנייה, למשל "3.4 שנ׳"
export const formatResponseTime = (ms: number) => `${(ms / 1000).toFixed(1)} שנ׳`
