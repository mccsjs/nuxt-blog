/**
 * app/utils/ 下的具名导出会被 Nuxt 自动导入，
 * 组件模板和页面中可直接使用 formatDate()，无需 import。
 */
export function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}
