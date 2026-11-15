<script setup lang="ts">
const siteConfig = useSiteConfig()
const props = defineProps<{ error: { statusCode?: number; statusMessage?: string } }>()

useSeoMeta({ title: `页面不存在 - ${siteConfig.name}` })
</script>

<template>
  <div class="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
    <p class="bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-8xl font-extrabold text-transparent">
      {{ error.statusCode || 404 }}
    </p>
    <h1 class="mt-4 text-xl font-bold text-slate-700 dark:text-slate-200">
      {{ error.statusCode === 404 ? '页面被微风吹走了 🍃' : (error.statusMessage || '出现了一些问题') }}
    </h1>
    <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">别担心，回到首页继续探索吧。</p>
    <button
      class="mt-8 rounded-full bg-gradient-to-r from-teal-500 to-sky-500 px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-soft-lg"
      @click="clearError({ redirect: '/' })"
    >
      回到首页
    </button>
  </div>
</template>
