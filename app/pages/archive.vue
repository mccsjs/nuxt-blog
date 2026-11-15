<script setup lang="ts">
const siteConfig = useSiteConfig()

const { data: posts } = await useAsyncData('archive-posts', () =>
  queryCollection('posts').select('path', 'title', 'date', 'category').order('date', 'DESC').all(),
)

const grouped = computed(() => {
  const map = new Map<string, typeof posts.value>()
  for (const post of posts.value || []) {
    const year = post.date?.slice(0, 4) || '未知'
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(post)
  }
  return [...map.entries()]
})

useSeoMeta({ title: `归档 - ${siteConfig.name}`, description: `按年份浏览博客文章，共 ${posts.value?.length || 0} 篇` })
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <section class="fade-up mb-10 text-center">
      <h1 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100">时间归档</h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        共 <span class="font-semibold text-teal-600 dark:text-teal-300">{{ posts?.length || 0 }}</span> 篇文章
      </p>
    </section>

    <div class="space-y-10">
      <section v-for="[year, items] in grouped" :key="year" class="fade-up">
        <div class="mb-4 flex items-center gap-3">
          <span class="rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 px-4 py-1.5 text-lg font-bold text-white shadow-soft">
            {{ year }}
          </span>
          <span class="text-sm text-slate-400">{{ items?.length }} 篇</span>
          <div class="h-px flex-1 bg-gradient-to-r from-teal-200/80 to-transparent dark:from-teal-700/50"></div>
        </div>
        <ul class="relative ml-4 space-y-1 border-l-2 border-teal-100 pl-6 dark:border-teal-800/50">
          <li v-for="post in items" :key="post.path">
            <NuxtLink
              :to="post.path"
              class="group -ml-[1.9rem] flex items-center gap-3 rounded-xl py-2 pl-8 pr-3 transition hover:bg-teal-50/80 dark:hover:bg-teal-900/30"
            >
              <span
                class="absolute left-0 h-2.5 w-2.5 -translate-x-[5px] rounded-full bg-teal-300 ring-4 ring-white transition group-hover:scale-125 group-hover:bg-teal-500 dark:ring-slate-900"
              ></span>
              <span class="shrink-0 font-mono text-xs text-slate-400">{{ formatDateShort(post.date) }}</span>
              <span class="truncate text-sm font-medium text-slate-700 transition group-hover:text-teal-600 dark:text-slate-200 dark:group-hover:text-teal-300">
                {{ post.title }}
              </span>
              <span class="ml-auto hidden shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-400 sm:inline-block dark:bg-slate-800 dark:text-slate-500">
                {{ post.category }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
