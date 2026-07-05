export const APP_NAME = 'Mario Business'
export const APP_VERSION = '1.0.0'
export const DEFAULT_API_URL = 'https://mario-v2-backend.ntoric.com/api'

export const PERIOD_LABELS: Record<string, string> = {
  today: 'Today',
  week: '7 Days',
  month: '30 Days',
  all: 'All Time',
}

export function getPeriodStartDate(period: string): Date | null {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  switch (period) {
    case 'today':
      return today
    case 'week':
      return new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)
    case 'month':
      return new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000)
    case 'all':
      return null
    default:
      return null
  }
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(0)}`
}

export function formatCurrency2(amount: number): string {
  return `₹${amount.toFixed(2)}`
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${months[d.getMonth()]} ${pad(d.getDate())}, ${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function formatShortDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}`
}
