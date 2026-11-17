<script setup lang="ts">
const siteConfig = useBlogConfig()

const { data: posts } = await useAsyncData('all-posts', () =>
  queryCollection('posts')
    .select('path', 'title', 'description', 'date', 'category', 'tags', 'image')
    .order('date', 'DESC')
    .all(),
)

usePageSeo({ title: `文章 - ${siteConfig.name}`, description: siteConfig.description })
</script>

<template>
  <div>
    <section class="fade-up mb-8 text-center">
      <h1 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100">全部文章</h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        共 {{ posts?.length || 0 }} 篇
      </p>
    </section>

    <TabNav />

    <div class="grid gap-8 lg:grid-cols-[1fr_18rem]">
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
      <Sidebar class="lg:block" />
    </div>
  </div>
</template>
