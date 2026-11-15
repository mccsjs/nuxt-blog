export const useTheme = () => {
  const isDark = useState<boolean>('theme-dark', () => false)

  if (import.meta.client) {
    isDark.value = document.documentElement.classList.contains('dark')
  }

  const toggle = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    try {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    } catch {}
  }

  return { isDark, toggle }
}
