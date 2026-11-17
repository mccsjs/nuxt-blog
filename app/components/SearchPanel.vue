<script setup lang="ts">
const searchOpen = useState('search-open', () => false)
const keyword = ref('')
const inputEl = ref<HTMLInputElement>()

interface SearchItem {
  path: string
  title: string
  description?: string
  category?: string
  tags?: string[]
  date?: string
}

const { data: posts } = await useAsyncData('search-posts', () =>
  queryCollection('posts').select('path', 'title', 'description', 'category', 'tags', 'date').all(),
  { lazy: true },
)

const results = computed<SearchItem[]>(() => {
  const list = (posts.value || []) as SearchItem[]
  const q = keyword.value.trim().toLowerCase()
  if (!q) return []
  return list
    .filter((p) => {
      const hay = [p.title, p.description, p.category, ...(p.tags || [])].join(' ').toLowerCase()
      return hay.includes(q)
    })
    .slice(0, 8)
})

function highlightParts(text: string): { text: string, hit: boolean }[] {
  const q = keyword.value.trim()
  if (!q) return [{ text, hit: false }]
  const parts: { text: string, hit: boolean }[] = []
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  let last = 0
  for (const m of text.matchAll(re)) {
    const at = m.index ?? 0
    if (at > last) parts.push({ text: text.slice(last, at), hit: false })
    parts.push({ text: m[0], hit: true })
    last = at + m[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last), hit: false })
  return parts
}

const activeIndex = ref(0)
watch(keyword, () => (activeIndex.value = 0))
watch(results, () => {
  if (activeIndex.value >= results.value.length) activeIndex.value = 0
})

function close() {
  searchOpen.value = false
  keyword.value = ''
}

function open(item: SearchItem) {
  close()
  navigateTo(item.path)
}

watch(searchOpen, (open) => {
  if (open) {
    nextTick(() => inputEl.value?.focus())
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
  if (!results.value.length) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % results.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + results.value.length) % results.value.length
  } else if (e.key === 'Enter' && results.value[activeIndex.value]) {
    open(results.value[activeIndex.value])
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="searchOpen"
        class="fixed inset-0 z-50 flex items-start justify-center bg-white/60 px-4 pt-[12vh] backdrop-blur-lg backdrop-saturate-150 dark:bg-slate-950/70"
        @click.self="close"
        @keydown="onKey"
      >
        <Transition appear enter-active-class="transition duration-300 ease-out" enter-from-class="-translate-y-5 scale-95 opacity-0">
          <div class="flex max-h-[70vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-slate-900/10 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900">
            <div class="flex items-center gap-2.5 border-b border-slate-900/[0.06] px-[18px] py-4 dark:border-white/[0.06]">
              <Icon name="search" class="h-5 w-5 shrink-0 text-slate-500" />
              <input
                ref="inputEl"
                v-model="keyword"
                type="text"
                placeholder="搜索文章..."
                autocomplete="off"
                class="w-full flex-1 bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-400"
              />
              <button class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900/[0.04] text-slate-500 transition hover:bg-slate-900/[0.08] dark:bg-white/[0.06] dark:text-slate-400 dark:hover:bg-white/10" aria-label="关闭" @click="close">
                <Icon name="close" class="h-[18px] w-[18px]" />
              </button>
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto p-2">
              <p v-if="!results.length && keyword.trim()" class="px-4 py-8 text-center text-sm text-slate-500">没有找到相关文章</p>
              <button
                v-for="(item, i) in results"
                :key="item.path"
                class="flex w-full animate-[search-in_.25s_ease-out_both] flex-col gap-1 rounded-[10px] px-3.5 py-3 text-left transition"
                :style="{ animationDelay: `${(i + 1) * 0.03}s` }"
                :class="i === activeIndex ? 'bg-slate-900/[0.04] dark:bg-white/[0.06]' : 'hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.06]'"
                @mouseenter="activeIndex = i"
                @click="open(item)"
              >
                <span class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  <template v-for="(part, pi) in highlightParts(item.title)" :key="pi"><mark v-if="part.hit" class="rounded-sm bg-amber-200/60 px-0.5 text-amber-900 dark:bg-amber-500/40 dark:text-amber-50">{{ part.text }}</mark><template v-else>{{ part.text }}</template></template>
                </span>
                <span v-if="item.description" class="line-clamp-2 text-[13px] leading-normal text-slate-500 dark:text-slate-400">
                  <template v-for="(part, pi) in highlightParts(item.description)" :key="pi"><mark v-if="part.hit" class="rounded-sm bg-amber-200/60 px-0.5 text-amber-900 dark:bg-amber-500/40 dark:text-amber-50">{{ part.text }}</mark><template v-else>{{ part.text }}</template></template>
                </span>
                <span v-if="item.date" class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ formatDateDay(item.date) }}</span>
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-1 border-t border-slate-900/[0.04] px-[18px] py-2.5 text-xs text-slate-500 dark:border-white/[0.04] dark:text-slate-400">
              输入关键词搜索文章，按 <kbd class="inline-flex min-w-5 items-center justify-center rounded border border-slate-900/10 bg-slate-900/[0.03] px-1 text-[11px] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">↑</kbd>
              <kbd class="inline-flex min-w-5 items-center justify-center rounded border border-slate-900/10 bg-slate-900/[0.03] px-1 text-[11px] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">↓</kbd>
              导航，<kbd class="inline-flex min-w-5 items-center justify-center rounded border border-slate-900/10 bg-slate-900/[0.03] px-1 text-[11px] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">Enter</kbd>
              打开，<kbd class="inline-flex min-w-5 items-center justify-center rounded border border-slate-900/10 bg-slate-900/[0.03] px-1 text-[11px] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">Esc</kbd>
              关闭
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
