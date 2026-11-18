<script setup lang="ts">
const siteConfig = useBlogConfig()

usePageSeo({
  title: `留言板 - ${siteConfig.name}`,
  description: '留言板 — 有任何问题或想法，欢迎在此留言',
})
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <section class="fade-up mb-8 text-center">
      <h1 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100">留言板</h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        有任何问题或想法，欢迎在此留言
      </p>
    </section>

    <PostComments />
  </div>
</template>
