import { describe, expect, it } from 'vitest'
import { formatDate, formatDateShort, gradientFor } from '../../app/utils/format'

describe('format utils', () => {
  it('formats a full date', () => {
    expect(formatDate('2026-11-08')).toBe('2026 年 11 月 8 日')
  })

  it('formats a short date', () => {
    expect(formatDateShort('2026-11-08')).toBe('11-08')
  })

  it('falls back to the raw value', () => {
    expect(formatDate('')).toBe('')
  })

  it('is deterministic for the same seed', () => {
    expect(gradientFor('hello')).toBe(gradientFor('hello'))
  })
})
