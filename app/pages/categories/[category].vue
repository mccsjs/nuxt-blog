<script setup lang="ts">
const siteConfig = useSiteConfig()

const route = useRoute()
const category = computed(() => String(route.params.category))

const { data: posts } = await useAsyncData(`category-${route.params.category}`, () =>
  queryCollection('posts')
    .select('path', 'title', 'description', 'date', 'category', 'tags', 'image')
    .order('date', 'DESC')
    .all(),
)

const filtered = computed(() => (posts.value || []).filter((p) => (p.category || '随笔') === category.value))

useSeoMeta({ title: () => `分类「${category.value}」- ${siteConfig.name}`, description: () => `分类「${category.value}」下的文章，共 ${filtered.value.length} 篇` })
</script>

<template>
  <div>
    <section class="fade-up mb-8 text-center">
      <h1 class="inline-flex items-center gap-2 text-2xl font-extrabold text-slate-800 dark:text-slate-100">
        <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-sky-400 text-white">
          <Icon name="folder" class="h-4.5 w-4.5" />
        </span>
        {{ category }}
      </h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">共 {{ filtered.length }} 篇文章</p>
    </section>

    <div class="space-y-4">
      <PostCard
        v-for="post in filtered"
        :key="post.path"
        horizontal
        :title="post.title"
        :path="post.path"
        :description="post.description"
        :date="formatDateDay(post.date)"
        :category="post.category"
        :tags="post.tags"
        :image="post.image"
      />
    </div>

    <div v-if="!filtered.length" class="mt-16 text-center text-slate-400">
      <p class="text-lg">这个分类下还没有文章 🌱</p>
      <NuxtLink to="/categories" class="mt-4 inline-block text-sm text-teal-600 hover:underline dark:text-teal-300">← 查看其他分类</NuxtLink>
    </div>
  </div>
</template>
