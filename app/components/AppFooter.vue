<script setup lang="ts">
const siteConfig = useSiteConfig()

const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative z-10 border-t border-slate-200/70 py-8 dark:border-slate-800/70">
    <div class="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 sm:px-6">
      <div class="flex items-center gap-3">
        <img :src="siteConfig.avatar" alt="" class="h-7 w-7 rounded-full" />
        <span class="text-sm font-semibold text-slate-600 dark:text-slate-300">{{ siteConfig.name }}</span>
      </div>
      <p class="text-xs text-slate-400 dark:text-slate-500">
        Copyright © {{ year }} {{ siteConfig.author }} · Powered by
        <a href="https://nuxt.com" target="_blank" rel="noopener" class="text-teal-500 hover:underline">Nuxt</a>
        &amp; Tailwind CSS{{ siteConfig.footerNote }}
      </p>
    </div>
  </footer>
</template>
