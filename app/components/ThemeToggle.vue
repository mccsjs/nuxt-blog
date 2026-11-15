<script setup lang="ts">
const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    class="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-teal-100/80 hover:text-teal-600 dark:text-slate-400 dark:hover:bg-teal-800/40 dark:hover:text-teal-300"
    :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
    @click="toggle"
  >
    <ClientOnly>
      <Icon :name="isDark ? 'sun' : 'moon'" />
      <template #fallback>
        <span class="h-5 w-5"></span>
      </template>
    </ClientOnly>
  </button>
</template>
