<script setup lang="ts">
const route = useRoute()
const { site } = useAppConfig()

// 官方 catch-all 写法：Markdown 文件与站点路由一一对应
const { data: page } = await useAsyncData(`page-${route.path}`, () =>
  queryCollection('content').path(route.path).first(),
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: `${page.value.title} · ${site.name}`,
  description: page.value.description,
})
</script>

<template>
  <article v-if="page" class="post">
    <NuxtLink to="/" class="back-link">← 返回文章列表</NuxtLink>
    <h1>{{ page.title }}</h1>
    <div class="post-meta">
      <time v-if="page.date" :datetime="page.date">{{ formatDate(page.date) }}</time>
      <span v-for="tag in page.tags || []" :key="tag" class="tag">#{{ tag }}</span>
    </div>
    <ContentRenderer :value="page" class="prose" />
  </article>
</template>
