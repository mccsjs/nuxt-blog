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
  if (!q) return list.slice(0, 6)
  return list
    .filter((p) => {
      const hay = [p.title, p.description, p.category, ...(p.tags || [])].join(' ').toLowerCase()
      return hay.includes(q)
    })
    .slice(0, 8)
})

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
        class="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/30 px-4 pt-[14vh] backdrop-blur-sm dark:bg-slate-950/60"
        @click.self="close"
        @keydown="onKey"
      >
        <Transition appear enter-active-class="transition duration-200 ease-out" enter-from-class="scale-95 opacity-0">
          <div class="w-full max-w-xl overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-soft-lg backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95">
            <div class="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <Icon name="search" class="h-5 w-5 text-teal-500" />
              <input
                ref="inputEl"
                v-model="keyword"
                type="text"
                placeholder="搜索文章标题、标签…"
                class="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
              <button class="rounded-lg border border-slate-200 px-2 py-0.5 text-[10px] text-slate-400 dark:border-slate-700" @click="close">Esc</button>
            </div>

            <div class="max-h-80 overflow-y-auto p-2">
              <p v-if="!results.length" class="px-4 py-8 text-center text-sm text-slate-400">没有找到相关文章 🍂</p>
              <button
                v-for="(item, i) in results"
                :key="item.path"
                class="flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left transition"
                :class="i === activeIndex ? 'bg-teal-50 dark:bg-teal-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'"
                @mouseenter="activeIndex = i"
                @click="open(item)"
              >
                <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400/80 to-sky-400/80 text-white">
                  <Icon name="posts" class="h-4 w-4" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{{ item.title }}</span>
                  <span class="mt-0.5 block truncate text-xs text-slate-400">{{ item.description || item.category }}</span>
                </span>
                <span v-if="item.date" class="mt-1 shrink-0 text-[11px] text-slate-300 dark:text-slate-500">{{ item.date }}</span>
              </button>
            </div>

            <div class="flex items-center justify-between border-t border-slate-100 px-5 py-2.5 text-[11px] text-slate-400 dark:border-slate-800">
              <span class="flex items-center gap-1"><Icon name="spark" class="h-3.5 w-3.5 text-teal-400" /> 共 {{ (posts || []).length }} 篇文章</span>
              <span>↑ ↓ 选择 · Enter 打开</span>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
