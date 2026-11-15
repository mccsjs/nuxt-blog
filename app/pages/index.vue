<script setup lang="ts">
const { site } = useAppConfig()

// 官方 Content v3 查询 API：path 是 page 集合内置字段，date / tags 来自 content.config.ts 的 schema
const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('content')
    .where('path', 'LIKE', '/blog/%')
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'tags')
    .all(),
)

useSeoMeta({
  title: site.name,
  description: site.description,
})
</script>

<template>
  <div>
    <section class="hero">
      <h1>{{ site.name }}</h1>
      <p>{{ site.description }}</p>
    </section>

    <section>
      <h2 class="section-title">最新文章</h2>
      <div v-if="posts && posts.length" class="post-list">
        <BlogCard v-for="post in posts" :key="post.path" :post="post" />
      </div>
      <p v-else class="empty-hint">
        还没有文章：在 <code>content/blog/</code> 下新建一个 Markdown 文件即可。
      </p>
    </section>
  </div>
</template>
