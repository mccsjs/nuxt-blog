<script setup lang="ts">
const siteConfig = useBlogConfig()

const { data: posts } = await useAsyncData('home-posts', () =>
  queryCollection('posts')
    .select('path', 'title', 'description', 'date', 'category', 'tags', 'image')
    .order('date', 'DESC')
    .limit(6)
    .all(),
)

usePageSeo({ title: siteConfig.name, description: siteConfig.description })
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 sm:px-6">
    <!-- Hero -->
    <section class="fade-up flex flex-col items-center py-10 text-center sm:py-16">
      <div class="relative">
        <div class="absolute -inset-2 rounded-full bg-gradient-to-tr from-teal-300/60 via-sky-300/60 to-emerald-300/60 blur-lg dark:from-teal-500/30 dark:via-sky-500/30 dark:to-emerald-500/30"></div>
        <NuxtImg
          :src="siteConfig.avatar"
          alt="头像"
          width="112"
          height="112"
          format="webp"
          :preload="{ fetchPriority: 'high' }"
          class="relative h-28 w-28 rounded-full border-4 border-white shadow-soft-lg dark:border-slate-800"
        />
        <div class="pointer-events-none absolute inset-0 rounded-full dark:bg-black/10"></div>
      </div>
      <h1 class="mt-6 text-3xl font-extrabold tracking-wide text-slate-800 sm:text-4xl dark:text-slate-100">
        <span class="bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-transparent">{{ siteConfig.name }}</span>
      </h1>
      <HitokotoType />
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
            :date="formatDateDay(post.date)"
            :category="post.category"
            :tags="post.tags"
            :image="post.image"
          />
        </div>
      </section>

      <Sidebar class="lg:block" />
    </div>
  </div>
</template>
