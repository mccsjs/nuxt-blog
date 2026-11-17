<script setup lang="ts">
const siteConfig = useSiteConfig()

const route = useRoute()
const tag = computed(() => String(route.params.tag))

const { data: posts } = await useAsyncData(`tag-${route.params.tag}`, () =>
  queryCollection('posts')
    .select('path', 'title', 'description', 'date', 'category', 'tags', 'image')
    .order('date', 'DESC')
    .all(),
)

const filtered = computed(() => (posts.value || []).filter((p) => (p.tags || []).includes(tag.value)))

useSeoMeta({ title: () => `标签「${tag.value}」- ${siteConfig.name}`, description: () => `包含「${tag.value}」标签的文章，共 ${filtered.value.length} 篇` })
</script>

<template>
  <div>
    <section class="fade-up mb-8 text-center">
      <h1 class="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
        <span class="text-teal-500">#</span>
        {{ tag }}
      </h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">共 {{ filtered.length }} 篇文章</p>
    </section>

    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <PostCard
        v-for="post in filtered"
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

    <div v-if="!filtered.length" class="mt-16 text-center text-slate-400">
      <p class="text-lg">这个标签下还没有文章 🌱</p>
      <NuxtLink to="/tags" class="mt-4 inline-block text-sm text-teal-600 hover:underline dark:text-teal-300">← 查看其他标签</NuxtLink>
    </div>
  </div>
</template>
