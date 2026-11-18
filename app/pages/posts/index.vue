<script setup lang="ts">
const siteConfig = useBlogConfig()
const route = useRoute()

const { data: posts } = await useAsyncData('all-posts', () =>
  queryCollection('posts')
    .select('path', 'title', 'description', 'date', 'category', 'tags', 'image')
    .order('date', 'DESC')
    .all(),
)

const PAGE_SIZE = 9

const page = computed(() => {
  const raw = Number(route.query.page)
  return Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1
})

const totalPages = computed(() => Math.max(1, Math.ceil((posts.value?.length || 0) / PAGE_SIZE)))

const pagedPosts = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return (posts.value || []).slice(start, start + PAGE_SIZE)
})

watch(page, () => {
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
})

usePageSeo({
  title: () => (page.value > 1 ? `文章 第 ${page.value} 页 - ${siteConfig.name}` : `文章 - ${siteConfig.name}`),
  description: siteConfig.description,
})
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

    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <PostCard
        v-for="post in pagedPosts"
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

    <nav v-if="totalPages > 1" class="mt-10 flex items-center justify-center gap-1.5" aria-label="分页">
      <NuxtLink
        v-if="page > 1"
        :to="{ query: { page: page - 1 } }"
        class="flex h-9 items-center rounded-full px-3.5 text-sm text-slate-600 transition hover:bg-slate-900/5 dark:text-slate-400 dark:hover:bg-white/8"
      >
        上一页
      </NuxtLink>

      <NuxtLink
        v-for="n in totalPages"
        :key="n"
        :to="{ query: { page: n } }"
        class="flex h-9 w-9 items-center justify-center rounded-full text-sm transition"
        :class="n === page
          ? 'bg-teal-600 font-semibold text-white dark:bg-teal-500'
          : 'text-slate-600 hover:bg-slate-900/5 dark:text-slate-400 dark:hover:bg-white/8'"
      >
        {{ n }}
      </NuxtLink>

      <NuxtLink
        v-if="page < totalPages"
        :to="{ query: { page: page + 1 } }"
        class="flex h-9 items-center rounded-full px-3.5 text-sm text-slate-600 transition hover:bg-slate-900/5 dark:text-slate-400 dark:hover:bg-white/8"
      >
        下一页
      </NuxtLink>
    </nav>
  </div>
</template>
