<script setup lang="ts">
const searchOpen = useState('search-open', () => false)
const mobileOpen = ref(false)
const route = useRoute()

watch(() => route.path, () => {
  mobileOpen.value = false
})

const navs = [
  { label: '首页', to: '/', icon: 'home' },
  { label: '文章', to: '/posts', icon: 'posts' },
  { label: '归档', to: '/archive', icon: 'archive' },
  { label: '标签', to: '/tags', icon: 'tags' },
  { label: '关于', to: '/about', icon: 'user' },
]

const isMac = import.meta.client ? /Mac|iPhone|iPad/.test(navigator.platform) : false

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchOpen.value = !searchOpen.value
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-40">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div
        class="mt-3 flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-2.5 shadow-soft backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/70"
      >
        <NuxtLink to="/" class="flex items-center gap-2.5 font-semibold text-slate-800 transition hover:text-teal-600 dark:text-slate-100 dark:hover:text-teal-300">
          <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-sky-400 text-white shadow-sm">
            <Icon name="spark" class="h-4.5 w-4.5" />
          </span>
          <span class="text-base tracking-wide">清风小筑</span>
        </NuxtLink>

        <nav class="hidden items-center gap-1 md:flex">
          <NuxtLink
            v-for="nav in navs"
            :key="nav.to"
            :to="nav.to"
            class="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition"
            active-class="bg-teal-100/80 text-teal-700 dark:bg-teal-800/40 dark:text-teal-300"
            :exact-active-class="nav.to === '/' ? 'bg-teal-100/80 text-teal-700 dark:bg-teal-800/40 dark:text-teal-300' : undefined"
          >
            <Icon :name="nav.icon" class="h-4 w-4" />
            {{ nav.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-1.5">
          <button
            class="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs text-slate-400 transition hover:border-teal-300 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-500 dark:hover:border-teal-600 dark:hover:text-teal-300 sm:flex"
            @click="searchOpen = true"
          >
            <Icon name="search" class="h-4 w-4" />
            <span>搜索</span>
            <kbd class="rounded border border-slate-200 px-1 text-[10px] dark:border-slate-600">{{ isMac ? '⌘K' : 'Ctrl K' }}</kbd>
          </button>
          <button
            class="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-teal-100/80 hover:text-teal-600 dark:text-slate-400 dark:hover:bg-teal-800/40 dark:hover:text-teal-300 sm:hidden"
            title="搜索"
            @click="searchOpen = true"
          >
            <Icon name="search" />
          </button>
          <ThemeToggle />
          <button
            class="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-teal-100/80 hover:text-teal-600 dark:text-slate-400 dark:hover:bg-teal-800/40 dark:hover:text-teal-300 md:hidden"
            title="菜单"
            @click="mobileOpen = !mobileOpen"
          >
            <Icon :name="mobileOpen ? 'close' : 'menu'" />
          </button>
        </div>
      </div>

      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="-translate-y-2 opacity-0"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="-translate-y-2 opacity-0"
      >
        <nav
          v-if="mobileOpen"
          class="mt-2 flex flex-col gap-1 rounded-2xl border border-white/60 bg-white/90 p-2 shadow-soft-lg backdrop-blur-xl md:hidden dark:border-slate-700/60 dark:bg-slate-900/90"
        >
          <NuxtLink
            v-for="nav in navs"
            :key="nav.to"
            :to="nav.to"
            class="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition"
            active-class="bg-teal-100/80 text-teal-700 dark:bg-teal-800/40 dark:text-teal-300"
            :exact-active-class="nav.to === '/' ? 'bg-teal-100/80 text-teal-700 dark:bg-teal-800/40 dark:text-teal-300' : undefined"
          >
            <Icon :name="nav.icon" class="h-4 w-4" />
            {{ nav.label }}
          </NuxtLink>
        </nav>
      </Transition>
    </div>
  </header>

  <SearchPanel />
</template>
