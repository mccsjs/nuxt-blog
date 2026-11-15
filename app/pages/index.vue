<script setup lang="ts">
const siteConfig = useSiteConfig()

const { data: posts } = await useAsyncData('home-posts', () =>
  queryCollection('posts')
    .select('path', 'title', 'description', 'date', 'category', 'tags', 'image')
    .order('date', 'DESC')
    .limit(6)
    .all(),
)

useSeoMeta({
  title: siteConfig.name,
  description: siteConfig.description,
  ogTitle: siteConfig.name,
  ogDescription: siteConfig.description,
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 sm:px-6">
    <!-- Hero -->
    <section class="fade-up flex flex-col items-center py-10 text-center sm:py-16">
      <div class="relative">
        <div class="absolute -inset-2 rounded-full bg-gradient-to-tr from-teal-300/60 via-sky-300/60 to-emerald-300/60 blur-lg dark:from-teal-500/30 dark:via-sky-500/30 dark:to-emerald-500/30"></div>
        <img
          :src="siteConfig.avatar"
          alt="头像"
          class="relative h-28 w-28 rounded-full border-4 border-white shadow-soft-lg dark:border-slate-800"
        />
      </div>
      <h1 class="mt-6 text-3xl font-extrabold tracking-wide text-slate-800 sm:text-4xl dark:text-slate-100">
        你好，我是 <span class="bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-transparent">{{ siteConfig.author }}</span>
      </h1>
      <p class="mt-3 max-w-xl text-slate-500 dark:text-slate-400">{{ siteConfig.description }}</p>
      <div class="mt-5 flex flex-wrap justify-center gap-2">
        <span
          v-for="interest in siteConfig.interests"
          :key="interest"
          class="rounded-full border border-teal-200/70 bg-white/70 px-3.5 py-1 text-xs text-teal-600 dark:border-teal-700/60 dark:bg-slate-900/60 dark:text-teal-300"
        >
          ✦ {{ interest }}
        </span>
      </div>
      <div class="mt-7 flex items-center gap-3">
        <NuxtLink
          to="/posts"
          class="rounded-full bg-gradient-to-r from-teal-500 to-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-soft-lg"
        >
          浏览文章 →
        </NuxtLink>
        <NuxtLink
          to="/about"
          class="rounded-full border border-teal-200 bg-white/80 px-6 py-2.5 text-sm font-semibold text-teal-600 transition hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50 dark:border-teal-700/70 dark:bg-slate-900/70 dark:text-teal-300 dark:hover:bg-teal-900/40"
        >
          关于我
        </NuxtLink>
      </div>
    </section>

    <div class="mt-6 grid gap-8 lg:grid-cols-[1fr_18rem]">
      <!-- 最新文章 -->
      <section>
        <div class="mb-5 flex items-center justify-between">
          <h2 class="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100">
            <Icon name="spark" class="h-5 w-5 text-teal-500" />
            最新文章
          </h2>
          <NuxtLink to="/posts" class="text-sm text-teal-600 transition hover:translate-x-0.5 hover:underline dark:text-teal-300">
            查看全部 →
          </NuxtLink>
        </div>
        <div class="grid gap-5 sm:grid-cols-2">
          <PostCard
            v-for="post in posts"
            :key="post.path"
            :title="post.title"
            :path="post.path"
            :description="post.description"
            :date="post.date"
            :category="post.category"
            :tags="post.tags"
            :image="post.image"
          />
        </div>
      </section>

      <Sidebar class="hidden lg:block" />
    </div>
  </div>
</template>
