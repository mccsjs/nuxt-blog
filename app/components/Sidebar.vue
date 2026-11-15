<script setup lang="ts">
const siteConfig = useSiteConfig()

interface PostMeta { category?: string; tags?: string[] }

const { data: posts } = await useAsyncData('sidebar-posts', () =>
  queryCollection('posts').select('path', 'title', 'description', 'category', 'tags', 'date').all(),
  { lazy: true },
)

const categoryCount = computed(() => {
  const map = new Map<string, number>()
  for (const p of (posts.value || []) as PostMeta[]) {
    const c = p.category || '随笔'
    map.set(c, (map.get(c) || 0) + 1)
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1])
})

const tagCount = computed(() => {
  const map = new Map<string, number>()
  for (const p of (posts.value || []) as PostMeta[]) {
    for (const t of p.tags || []) map.set(t, (map.get(t) || 0) + 1)
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14)
})
</script>

<template>
  <aside class="space-y-6">
    <!-- 个人卡片 -->
    <div class="rounded-3xl border border-white/70 bg-white/85 p-6 text-center shadow-soft backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80">
      <NuxtLink to="/about" class="group mx-auto block w-fit">
        <img
          :src="siteConfig.avatar"
          alt="头像"
          class="mx-auto h-20 w-20 rounded-full border-4 border-teal-100 shadow-soft transition duration-300 group-hover:scale-105 group-hover:rotate-3 dark:border-teal-800/60"
        />
      </NuxtLink>
      <h3 class="mt-4 text-lg font-bold text-slate-800 dark:text-slate-100">{{ siteConfig.author }}</h3>
      <p class="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{{ siteConfig.slogan }}</p>
      <div class="mt-4 flex flex-wrap justify-center gap-1.5">
        <span
          v-for="interest in siteConfig.interests"
          :key="interest"
          class="rounded-full bg-teal-50 px-2.5 py-1 text-xs text-teal-600 dark:bg-teal-900/40 dark:text-teal-300"
        >
          {{ interest }}
        </span>
      </div>
      <div class="mt-5 flex items-center justify-center gap-2.5 border-t border-slate-100 pt-5 dark:border-slate-800">
        <a
          v-for="social in siteConfig.socials"
          :key="social.name"
          :href="social.url"
          target="_blank"
          rel="noopener"
          :title="social.name"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:-translate-y-0.5 hover:bg-teal-100 hover:text-teal-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-teal-800/50 dark:hover:text-teal-300"
        >
          <Icon :name="social.icon" class="h-4.5 w-4.5" />
        </a>
      </div>
    </div>

    <!-- 分类卡片 -->
    <div class="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80">
      <h3 class="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
        <Icon name="folder" class="h-4 w-4 text-teal-500" />
        分类
      </h3>
      <ul class="space-y-2.5">
        <li v-for="[name, count] in categoryCount" :key="name">
          <NuxtLink
            :to="`/categories/${encodeURIComponent(name)}`"
            class="group flex items-center justify-between rounded-xl px-3 py-2 text-sm transition hover:bg-teal-50 dark:hover:bg-teal-900/30"
          >
            <span class="text-slate-600 transition group-hover:text-teal-600 dark:text-slate-300 dark:group-hover:text-teal-300">{{ name }}</span>
            <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-400 group-hover:bg-teal-100 group-hover:text-teal-600 dark:bg-slate-800 dark:text-slate-500 dark:group-hover:bg-teal-800/50 dark:group-hover:text-teal-300">{{ count }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- 标签云 -->
    <div class="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80">
      <h3 class="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
        <Icon name="tags" class="h-4 w-4 text-teal-500" />
        标签云
      </h3>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="[name, count] in tagCount"
          :key="name"
          :to="`/tags/${encodeURIComponent(name)}`"
          class="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs text-slate-500 transition hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-teal-600 dark:hover:bg-teal-900/40 dark:hover:text-teal-300"
        >
          {{ name }} · {{ count }}
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>
