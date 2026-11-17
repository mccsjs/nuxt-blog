export function formatDate(date: string): string {
  if (!date) return ''
  const [y, m, d] = date.slice(0, 10).split('-').map(Number)
  if (!y || !m || !d) return date
  return `${y} 年 ${m} 月 ${d} 日`
}

export function formatDateDay(date: string): string {
  if (!date) return ''
  const [y, m, d] = date.slice(0, 10).split('-')
  return y && m && d ? `${y}-${m}-${d}` : date
}

export function formatDateShort(date: string): string {
  if (!date) return ''
  const [, m, d] = date.slice(0, 10).split('-')
  return m && d ? `${m}-${d}` : date
}

export function gradientFor(seed: string): string {
  const palettes = [
    'from-teal-200 via-sky-200 to-cyan-200 dark:from-teal-800 dark:via-sky-900 dark:to-cyan-900',
    'from-sky-200 via-indigo-200 to-teal-200 dark:from-sky-900 dark:via-indigo-900 dark:to-teal-900',
    'from-emerald-200 via-teal-200 to-sky-200 dark:from-emerald-900 dark:via-teal-900 dark:to-sky-900',
    'from-cyan-200 via-teal-200 to-emerald-200 dark:from-cyan-900 dark:via-teal-900 dark:to-emerald-900',
    'from-lime-200 via-emerald-200 to-teal-200 dark:from-lime-900 dark:via-emerald-900 dark:to-teal-900',
    'from-rose-200 via-orange-200 to-amber-200 dark:from-rose-950 dark:via-orange-950 dark:to-amber-900',
  ]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return palettes[hash % palettes.length]
}
