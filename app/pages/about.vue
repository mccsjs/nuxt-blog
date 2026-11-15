<script setup lang="ts">
const siteConfig = useSiteConfig()

const { data: page } = await useAsyncData('about-page', () => queryCollection('pages').path('/pages/about').first())

useSeoMeta({ title: `关于 - ${siteConfig.name}`, description: `关于 ${siteConfig.author}` })
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <section class="fade-up mb-8 text-center">
      <img
        :src="siteConfig.avatar"
        alt="头像"
        class="mx-auto h-24 w-24 rounded-full border-4 border-white shadow-soft-lg dark:border-slate-800"
      />
      <h1 class="mt-4 text-3xl font-extrabold text-slate-800 dark:text-slate-100">关于我</h1>
      <p class="mt-2 text-slate-500 dark:text-slate-400">{{ siteConfig.slogan }}</p>
    </section>

    <div class="fade-up rounded-3xl border border-white/70 bg-white/85 p-7 shadow-soft backdrop-blur sm:p-9 dark:border-slate-700/70 dark:bg-slate-900/80">
      <ContentRenderer
        v-if="page"
        :value="page"
        class="prose prose-slate max-w-none dark:prose-invert"
      />
    </div>

    <div class="fade-up mt-6 flex flex-wrap items-center justify-center gap-3 rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80">
      <a
        v-for="social in siteConfig.socials"
        :key="social.name"
        :href="social.url"
        target="_blank"
        rel="noopener"
        class="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-600 transition hover:-translate-y-0.5 hover:bg-teal-100 hover:text-teal-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-teal-800/50 dark:hover:text-teal-300"
      >
        <Icon :name="social.icon" class="h-4 w-4" />
        {{ social.name }}
      </a>
    </div>
  </div>
</template>
