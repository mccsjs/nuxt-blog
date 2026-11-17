<script setup lang="ts">
import { IconMoonStars, IconSunLow } from '@tabler/icons-vue'

const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    class="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-teal-100/80 hover:text-teal-600 dark:text-slate-400 dark:hover:bg-teal-800/40 dark:hover:text-teal-300"
    :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
    @click="toggle"
  >
    <ClientOnly>
      <IconSunLow v-if="isDark" :size="20" :stroke="1.8" />
      <IconMoonStars v-else :size="20" :stroke="1.8" />
      <template #fallback>
        <span class="h-5 w-5"></span>
      </template>
    </ClientOnly>
  </button>
</template>
