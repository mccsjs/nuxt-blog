<script setup lang="ts">
const siteConfig = useSiteConfig()

const route = useRoute()
const path = `/posts/${route.params.slug}`

const { data: post } = await useAsyncData(`post-${route.params.slug}`, () =>
  queryCollection('posts').path(path).first(),
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在', fatal: true })
}

const { data: surround } = await useAsyncData(`surround-${route.params.slug}`, () =>
  queryCollectionItemSurroundings('posts', path, { fields: ['title', 'description', 'date'] }),
)

const prev = computed(() => surround.value?.[0])
const next = computed(() => surround.value?.[1])

useSeoMeta({
  title: () => `${post.value?.title} - ${siteConfig.name}`,
  description: () => post.value?.description || siteConfig.description,
})
</script>

<template>
  <div v-if="post" class="grid gap-8 xl:grid-cols-[1fr_16rem]">
    <article class="min-w-0">
      <!-- 文章头部 -->
      <header class="fade-up rounded-3xl border border-white/70 bg-white/85 p-7 shadow-soft backdrop-blur sm:p-9 dark:border-slate-700/70 dark:bg-slate-900/80">
        <div class="flex flex-wrap items-center gap-3 text-xs">
          <NuxtLink
            :to="`/categories/${encodeURIComponent(post.category)}`"
            class="rounded-full bg-teal-100/80 px-3 py-1 font-semibold text-teal-700 transition hover:bg-teal-200/80 dark:bg-teal-800/50 dark:text-teal-300 dark:hover:bg-teal-700/60"
          >
            {{ post.category }}
          </NuxtLink>
          <span class="flex items-center gap-1 text-slate-400">
            <Icon name="calendar" class="h-3.5 w-3.5" />
            {{ formatDate(post.date) }}
          </span>
          <span v-if="post.tags?.length" class="flex gap-2 text-slate-400">
            <NuxtLink
              v-for="tag in post.tags"
              :key="tag"
              :to="`/tags/${encodeURIComponent(tag)}`"
              class="transition hover:text-teal-500 dark:hover:text-teal-300"
            >
              # {{ tag }}
            </NuxtLink>
          </span>
        </div>
        <h1 class="mt-4 text-2xl font-extrabold leading-snug text-slate-800 sm:text-3xl dark:text-slate-100">
          {{ post.title }}
        </h1>
        <p v-if="post.description" class="mt-3 text-slate-500 dark:text-slate-400">{{ post.description }}</p>
      </header>

      <!-- 正文 -->
      <div class="fade-up mt-6 rounded-3xl border border-white/70 bg-white/85 p-7 shadow-soft backdrop-blur sm:p-9 dark:border-slate-700/70 dark:bg-slate-900/80">
        <ContentRenderer :value="post" class="prose prose-slate max-w-none dark:prose-invert" />
      </div>

      <!-- 上一篇 / 下一篇 -->
      <nav class="mt-6 grid gap-4 sm:grid-cols-2">
        <NuxtLink
          v-if="prev"
          :to="prev.path"
          class="group rounded-3xl border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:shadow-soft-lg dark:border-slate-700/70 dark:bg-slate-900/80"
        >
          <span class="flex items-center gap-1.5 text-xs text-slate-400">
            <Icon name="arrowLeft" class="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
            上一篇
          </span>
          <span class="mt-2 block truncate text-sm font-semibold text-slate-700 group-hover:text-teal-600 dark:text-slate-200 dark:group-hover:text-teal-300">
            {{ prev.title }}
          </span>
        </NuxtLink>
        <span v-else></span>
        <NuxtLink
          v-if="next"
          :to="next.path"
          class="group rounded-3xl border border-white/70 bg-white/85 p-5 text-right shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:shadow-soft-lg dark:border-slate-700/70 dark:bg-slate-900/80"
        >
          <span class="flex items-center justify-end gap-1.5 text-xs text-slate-400">
            下一篇
            <Icon name="arrowRight" class="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </span>
          <span class="mt-2 block truncate text-sm font-semibold text-slate-700 group-hover:text-teal-600 dark:text-slate-200 dark:group-hover:text-teal-300">
            {{ next.title }}
          </span>
        </NuxtLink>
      </nav>
    </article>

    <TocAside :links="post.body?.toc?.links" />
  </div>
</template>
