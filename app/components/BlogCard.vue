<script setup lang="ts">
type PostSummary = {
  path: string
  title?: string
  description?: string
  date?: string
  tags?: string[]
}

defineProps<{ post: PostSummary }>()
</script>

<template>
  <article class="post-card">
    <NuxtLink :to="post.path" class="post-card__title">
      {{ post.title || post.path }}
    </NuxtLink>
    <p v-if="post.description" class="post-card__desc">{{ post.description }}</p>
    <div class="post-card__meta">
      <time v-if="post.date" :datetime="post.date">{{ formatDate(post.date) }}</time>
      <span v-for="tag in post.tags || []" :key="tag" class="tag">#{{ tag }}</span>
    </div>
  </article>
</template>
