<script setup lang="ts">
const siteConfig = useBlogConfig()

const route = useRoute()
const path = route.path

const { data: post } = await useAsyncData(`post-${path}`, () =>
  queryCollection('posts').path(path).first(),
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在', fatal: true })
}

const { data: surround } = await useAsyncData(`surround-${path}`, () =>
  queryCollectionItemSurroundings('posts', path, { fields: ['title', 'description', 'date'] }),
)

const prev = computed(() => surround.value?.[0])
const next = computed(() => surround.value?.[1])

const articleUrl = computed(() => `${useRuntimeConfig().public.siteUrl}${post.value?.path || path}`)

const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
async function copyArticleUrl() {
  try {
    await navigator.clipboard.writeText(articleUrl.value)
    copyState.value = 'copied'
  } catch {
    copyState.value = 'failed'
  }
  setTimeout(() => { copyState.value = 'idle' }, 2000)
}

const contentRef = ref<HTMLElement | null>(null)
useFancybox(contentRef, () => route.path)

const tocLinks = useState<{ id?: string, text?: string, depth?: number }[]>('post-toc', () => [])
watch(() => post.value?.body?.toc?.links, (links) => {
  tocLinks.value = links || []
}, { immediate: true })

useSchemaOrg(() => ({
  '@type': 'BlogPosting',
  headline: post.value?.title,
  description: post.value?.description,
  image: post.value?.image ? `${siteConfig.url}${post.value.image}` : undefined,
  datePublished: post.value?.date,
  dateModified: post.value?.date,
  author: { '@type': 'Person', name: siteConfig.author },
  keywords: post.value?.tags?.join(','),
  mainEntityOfPage: `${siteConfig.url}${post.value?.path || ''}`,
}))

usePageSeo(() => ({
  title: `${post.value?.title} - ${siteConfig.name}`,
  description: post.value?.description || siteConfig.description,
  image: post.value?.image,
  imageWidth: 640,
  imageHeight: 360,
  type: 'article',
  publishedTime: post.value?.date,
  author: siteConfig.author,
  tags: post.value?.tags,
}))


</script>

<template>
  <div v-if="post" class="grid gap-8 lg:gap-12" :class="tocLinks.length ? 'lg:grid-cols-[2fr_280px]' : 'mx-auto max-w-3xl'">
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
        <h1 class="mt-4 text-2xl font-extrabold leading-snug text-slate-800 sm:text-3xl dark:text-slate-300">
          {{ post.title }}
        </h1>
        <p v-if="post.description" class="mt-3 text-slate-500 dark:text-slate-400">{{ post.description }}</p>
      </header>

      <!-- 正文 -->
      <div ref="contentRef" class="fade-up mt-6 rounded-3xl border border-white/70 bg-white/85 p-7 shadow-soft backdrop-blur sm:p-9 dark:border-slate-700/70 dark:bg-slate-900/80">
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

      <!-- 版权协议 -->
      <section class="relative mt-6 overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-6 py-5 shadow-soft backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80">
        <button
          type="button"
          title="复制链接"
          class="absolute right-3 top-3 flex items-center gap-1 rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1.5 text-xs text-slate-500 transition hover:border-teal-400 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-teal-500 dark:hover:text-teal-400"
          @click="copyArticleUrl"
        >
          <Icon :name="copyState === 'idle' ? 'link' : (copyState === 'copied' ? 'arrowRight' : 'close')" class="h-3.5 w-3.5" />
          <span>{{ copyState === 'copied' ? '已复制' : (copyState === 'failed' ? '复制失败' : '复制链接') }}</span>
        </button>

        <div class="pr-24 font-bold text-slate-700 dark:text-slate-200">{{ post.title }}</div>
        <a
          :href="articleUrl"
          class="mt-1 block break-all text-teal-700 underline underline-offset-2 dark:text-teal-400"
        >{{ articleUrl }}</a>

        <div class="mt-2 flex flex-col gap-3 sm:flex-row sm:gap-6">
          <div>
            <div class="text-sm text-slate-400 dark:text-slate-500">文章作者</div>
            <div class="text-slate-700 dark:text-slate-300">{{ siteConfig.author }}</div>
          </div>
          <div>
            <div class="text-sm text-slate-400 dark:text-slate-500">发布日期</div>
            <div class="text-slate-700 dark:text-slate-300">{{ formatDate(post.date) }}</div>
          </div>
          <div>
            <div class="text-sm text-slate-400 dark:text-slate-500">许可协议</div>
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans"
              target="_blank"
              rel="noopener noreferrer nofollow"
              class="inline-flex items-center gap-1.5 text-teal-700 underline underline-offset-2 dark:text-teal-400"
            >
              <span>CC BY-NC-SA 4.0</span>
              <span class="flex items-center gap-0.5">
                <img src="/cc/cc.svg" alt="CC" class="h-4 w-4 opacity-70 dark:invert dark:opacity-80" />
                <img src="/cc/by.svg" alt="BY" class="h-4 w-4 opacity-70 dark:invert dark:opacity-80" />
                <img src="/cc/nc.svg" alt="NC" class="h-4 w-4 opacity-70 dark:invert dark:opacity-80" />
                <img src="/cc/sa.svg" alt="SA" class="h-4 w-4 opacity-70 dark:invert dark:opacity-80" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <PostComments />
    </article>

    <TocAside :links="post.body?.toc?.links" />
  </div>
</template>
