/** Разбор ответа DRF (поля + detail) для показа в формах. */

function firstFieldMessage(data: Record<string, unknown>): string | null {
  for (const value of Object.values(data)) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      return value[0]
    }
    if (typeof value === 'string') {
      return value
    }
  }
  return null
}

export function formatApiFormError(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: Record<string, unknown> }).data
    if (data && typeof data === 'object') {
      const field = firstFieldMessage(data)
      if (field) {
        return field
      }
      const detail = data.detail
      if (typeof detail === 'string') {
        return detail
      }
      if (Array.isArray(detail) && detail[0]) {
        return String(detail[0])
      }
    }
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const m = (error as { message?: string }).message
    if (typeof m === 'string' && m.length > 0) {
      return m
    }
  }
  return fallback
}
