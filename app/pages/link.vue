<script setup lang="ts">
const siteConfig = useBlogConfig()

const { data: links } = await useAsyncData('links', () =>
  queryCollection('links').all(),
)

type LinkItem = NonNullable<typeof links.value>[number]

const groups = computed(() => {
  const map = new Map<string, NonNullable<typeof links.value>>()
  for (const link of links.value || []) {
    const key = link.type || '其他'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(link)
  }
  return [...map.entries()].map(([name, items]) => ({
    name,
    items: [...items].sort((a, b) => (Number(a.sort) || 999) - (Number(b.sort) || 999)),
  }))
})

const isLostGroup = (name: string) => /失联/.test(name)
const activeCount = computed(() =>
  (links.value || []).filter(link => !isLostGroup(link.type || '')).length,
)

const coverStage = ref<Record<string, number>>({})
const failedAvatars = ref(new Set<string>())

function safeUrl(url: string | null | undefined) {
  return (url || '').replace(/^http:\/\//, 'https://')
}

function coverFor(link: LinkItem) {
  return safeUrl(link.screenshot) || (link.url ? `https://s0.wp.com/mshots/v1/${encodeURIComponent(link.url)}?w=400&h=300` : '')
}

function stage(id: string) {
  return coverStage.value[id] || 0
}

function nextCover(id: string) {
  coverStage.value = { ...coverStage.value, [id]: stage(id) + 1 }
}

function onAvatarError(id: string) {
  failedAvatars.value = new Set([...failedAvatars.value, id])
}

const loaded = ref<Record<string, boolean>>({})

function markLoaded(key: string) {
  if (!loaded.value[key]) loaded.value = { ...loaded.value, [key]: true }
}

function coverKey(link: LinkItem) {
  return `${link.id}:cover:${stage(link.id)}`
}

function avatarKey(link: LinkItem) {
  return `${link.id}:avatar`
}

usePageSeo({ title: `友链 - ${siteConfig.name}`, description: `与 ${siteConfig.name} 交换链接的朋友们` })
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <section class="fade-up mb-10 text-center">
      <h1 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100">友情链接</h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        共 {{ activeCount }} 位朋友
      </p>
    </section>

    <section v-for="group in groups" :key="group.name" class="fade-up mb-12">
      <div class="mb-5 flex items-center gap-3">
        <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100">{{ group.name }}</h2>
        <span class="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-600 dark:bg-teal-900/40 dark:text-teal-300">{{ group.items.length }}</span>
        <span class="h-px flex-1 bg-slate-200 dark:bg-slate-700"></span>
      </div>

      <div v-if="isLostGroup(group.name)" class="flex flex-wrap items-center gap-x-6 gap-y-2 opacity-70">
        <span v-for="link in group.items" :key="link.id" class="text-sm text-slate-500 dark:text-slate-400">{{ link.name }}</span>
      </div>

      <div v-else class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <a
          v-for="link in group.items"
          :key="link.id"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group block"
        >
          <div class="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
            <div
              v-if="stage(link.id) < 2 && !loaded[coverKey(link)]"
              class="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
            ></div>
            <img
              v-if="stage(link.id) === 0 && coverFor(link)"
              :src="coverFor(link)"
              :alt="link.name"
              width="400"
              height="300"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
              class="relative h-full w-full object-cover transition duration-500 group-hover:scale-105"
              @load="markLoaded(coverKey(link))"
              @error="nextCover(link.id)"
            />
            <img
              v-else-if="stage(link.id) === 1 && link.avatar"
              :src="safeUrl(link.avatar)"
              :alt="link.name"
              width="400"
              height="300"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
              class="relative h-full w-full object-cover"
              @load="markLoaded(coverKey(link))"
              @error="nextCover(link.id)"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-gradient-to-br"
              :class="gradientFor(link.name)"
            >
              <span class="text-4xl font-bold text-teal-800 dark:text-white">{{ link.name.slice(0, 1) }}</span>
            </div>
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          <div class="mt-3 flex items-start gap-3">
            <span class="relative h-10 w-10 shrink-0">
              <span
                v-if="link.avatar && !failedAvatars.has(link.id) && !loaded[avatarKey(link)]"
                class="absolute inset-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"
              ></span>
              <img
                v-if="link.avatar && !failedAvatars.has(link.id)"
                :src="safeUrl(link.avatar)"
                :alt="link.name"
                width="40"
                height="40"
                loading="lazy"
                decoding="async"
                referrerpolicy="no-referrer"
                class="relative h-10 w-10 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
                @load="markLoaded(avatarKey(link))"
                @error="onAvatarError(link.id)"
              />
              <span
                v-else
                class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-teal-800 dark:text-white"
                :class="gradientFor(link.name)"
              >
                {{ link.name.slice(0, 1) }}
              </span>
              <span class="pointer-events-none absolute inset-0 rounded-full bg-black/2 dark:bg-black/10"></span>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-bold text-slate-800 transition group-hover:text-teal-600 dark:text-slate-300 dark:group-hover:text-teal-300">{{ link.name }}</span>
              <span class="mt-0.5 line-clamp-2 text-xs leading-snug text-slate-500 dark:text-slate-400">{{ link.description }}</span>
            </span>
          </div>
        </a>
      </div>
    </section>

    <section class="fade-up mt-8 rounded-3xl border border-white/70 bg-white/85 p-7 text-center shadow-soft backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80">
      <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100">申请友链</h2>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">欢迎独立博客互换链接，附上站名与地址发邮件给我。</p>
      <a
        :href="`mailto:${siteConfig.email}`"
        class="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
      >
        <Icon name="email" class="h-4 w-4" />
        {{ siteConfig.email }}
      </a>
    </section>

    <PostComments />
  </div>
</template>
