<script setup lang="ts">
const siteConfig = useSiteConfig()
const searchOpen = useState('search-open', () => false)
const mobileOpen = ref(false)
const route = useRoute()

const navRef = ref<HTMLElement | null>(null)
const navBorder = ref({ left: '0px', top: '0px', width: '0px', height: '0px' })
const navBorderVisible = ref(false)

watch(() => route.path, () => {
  mobileOpen.value = false
})

import { IconBook2, IconHome, IconInfoCircle, IconLink, IconSearch } from '@tabler/icons-vue'

const navs = [
  { label: '首页', to: '/', icon: markRaw(IconHome) },
  { label: '文章', to: '/posts', icon: markRaw(IconBook2) },
  { label: '归档', to: '/archive', icon: 'archive' },
  { label: '标签', to: '/tags', icon: 'tags' },
  { label: '友链', to: '/link', icon: markRaw(IconLink) },
  { label: '关于', to: '/about', icon: markRaw(IconInfoCircle) },
]

const isMac = import.meta.client ? /Mac|iPhone|iPad/.test(navigator.platform) : false

const menuOpen = ref(false)
let menuCloseTimer: ReturnType<typeof setTimeout> | null = null

const menuGroups = [
  {
    title: '我的网站',
    items: [
      { label: '个人主页', href: 'https://seln.cn/', icon: 'https://hexo.seln.cn/img/lemon.png' },
      { label: '博客', href: 'https://mccsjs.cn/', icon: 'https://mccsjs.cn/img/ico.jpg' },
      { label: '友链检测', href: 'https://fc.mccsjs.cn/', icon: 'https://fc.mccsjs.cn/favicon.ico' },
    ],
  },
  {
    title: '友情链接',
    items: [
      { label: '阿叶Ayeez', href: 'https://blog.ayeez.cn', icon: 'https://qiniu.ayeez.cn/avatar.jpg' },
      { label: '裕裕裕', href: 'https://yu-blog.top/', icon: '/friends/yuyu.webp' },
      { label: 'ZY知识库', href: 'https://blog.pljzy.top/', icon: '/friends/zy.webp' },
      { label: 'TangShiMei', href: 'https://blog.224418.xyz/', icon: '/friends/tangshimei.webp' },
    ],
  },
]

function openMenu() {
  if (menuCloseTimer) { clearTimeout(menuCloseTimer); menuCloseTimer = null }
  menuOpen.value = true
}
function scheduleCloseMenu() {
  if (menuCloseTimer) clearTimeout(menuCloseTimer)
  menuCloseTimer = setTimeout(() => { menuOpen.value = false }, 150)
}
function toggleMenu(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  menuOpen.value = !menuOpen.value
}
function onDocClick(e: MouseEvent) {
  const t = e.target as HTMLElement | null
  if (!t?.closest('.site-menu-root')) menuOpen.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  if (menuCloseTimer) clearTimeout(menuCloseTimer)
})

const segClass = 'flex h-11 shrink-0 items-center rounded-full border border-black/5 bg-white/70 shadow-soft backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-slate-900/80'
const iconBtnClass = 'flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-teal-100/70 hover:text-teal-600 dark:text-slate-400 dark:hover:bg-teal-800/40 dark:hover:text-teal-300'

function isActive(to: string) {
  const path = route.path.replace(/\/$/, '') || '/'
  const href = to.replace(/\/$/, '') || '/'
  return href === path || (path !== '/' && href !== '/' && path.startsWith(href))
}

function moveBorder(el: HTMLElement) {
  const nav = navRef.value
  if (!nav) return
  const rect = el.getBoundingClientRect()
  const navRect = nav.getBoundingClientRect()
  if (!rect.width) return
  navBorder.value = {
    left: `${rect.left - navRect.left}px`,
    top: `${(navRect.height - rect.height) / 2}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  }
}

function onNavEnter() {
  const nav = navRef.value
  if (!nav) return
  const items = [...nav.querySelectorAll<HTMLElement>('[data-nav-item]')]
  const target = items.find(el => isActive(el.dataset.navItem || '')) || items[0]
  if (!target) return
  moveBorder(target)
  navBorderVisible.value = true
}

function hideBorder() {
  navBorderVisible.value = false
}

function onItemEnter(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement | null
  if (!el) return
  moveBorder(el)
  navBorderVisible.value = true
}

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchOpen.value = !searchOpen.value
  }
}

onMounted(() => {
  window.addEventListener('resize', hideBorder)
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('resize', hideBorder)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
    <div class="relative mx-auto flex max-w-6xl items-center justify-between">
      <!-- 左段：图标 + 站名 -->
      <div :class="segClass" class="px-2">
        <div class="site-menu-root relative flex items-center gap-2">
          <button
            class="flex shrink-0 cursor-pointer items-center justify-center rounded-[9px] p-[3px] transition duration-200 hover:bg-black/6 active:scale-96 dark:hover:bg-white/8"
            aria-label="打开图标菜单"
            @pointerdown="toggleMenu"
            @mouseenter="openMenu"
            @mouseleave="scheduleCloseMenu"
          >
            <NuxtImg
              src="/favicon.webp"
              alt="站点图标"
              width="28"
              height="28"
              class="h-7 w-7 rounded-full"
            />
          </button>
          <NuxtLink to="/" class="rounded-full px-1.5 py-1 font-semibold text-slate-800 transition hover:text-teal-600 dark:text-slate-100 dark:hover:text-teal-300">
            <span class="pr-1 text-base tracking-wide">{{ siteConfig.name }}</span>
          </NuxtLink>

          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="-translate-y-1.5 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="-translate-y-1.5 opacity-0"
          >
            <div
              v-if="menuOpen"
              class="absolute left-0 top-full z-50 mt-2.5 w-80 rounded-2xl border border-slate-900/8 bg-white/92 p-3.5 shadow-soft-lg backdrop-blur-xl dark:border-white/6 dark:bg-slate-900/92"
              @mouseenter="openMenu"
              @mouseleave="scheduleCloseMenu"
            >
              <div
                v-for="(g, gi) in menuGroups"
                :key="g.title"
                :class="gi < menuGroups.length - 1 ? 'mb-2.5 border-b border-slate-100 pb-2.5 dark:border-white/5' : ''"
              >
                <div class="px-1.5 pb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{{ g.title }}</div>
                <div class="grid grid-cols-2 gap-1">
                  <a
                    v-for="item in g.items"
                    :key="item.label"
                    :href="item.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-2 whitespace-nowrap rounded-[10px] px-2.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-900/4 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/6 dark:hover:text-slate-100"
                  >
                    <img :src="item.icon" alt="" class="h-[18px] w-[18px] shrink-0 object-contain" loading="lazy" />
                    <span>{{ item.label }}</span>
                  </a>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- 中段：导航（hover 滑动胶囊边框） -->
      <nav
        ref="navRef"
        :class="segClass"
        class="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 px-1.5 md:flex"
        @mouseenter="onNavEnter"
        @mouseleave="hideBorder"
      >
        <span
          aria-hidden="true"
          class="pointer-events-none absolute rounded-full border-[1.5px] border-slate-800/75 opacity-0 transition-[left,top,width,height,opacity] duration-[250ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] dark:border-slate-300/70"
          :class="navBorderVisible ? 'opacity-100' : 'opacity-0'"
          :style="navBorder"
        />
        <NuxtLink
          v-for="nav in navs"
          :key="nav.to"
          :to="nav.to"
          :data-nav-item="nav.to"
          class="relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors"
          :class="isActive(nav.to)
            ? 'font-semibold text-slate-900 dark:text-white'
            : 'font-medium text-slate-600 dark:text-slate-300'"
          @mouseenter="onItemEnter"
        >
          <component :is="nav.icon" v-if="typeof nav.icon !== 'string'" :size="16" :stroke="1.8" class="h-4 w-4" />
          <Icon v-else :name="nav.icon" size="h-4 w-4" />
          {{ nav.label }}
        </NuxtLink>
      </nav>

      <!-- 右段：搜索 + 主题 + 菜单 -->
      <div :class="segClass" class="gap-0.5 px-1.5">
        <button :class="iconBtnClass" :title="`搜索 (${isMac ? '⌘K' : 'Ctrl K'})`" @click="searchOpen = true">
          <IconSearch :size="20" :stroke="1.8" />
        </button>
        <ThemeToggle />
        <a
          :class="iconBtnClass"
          href="https://www.travellings.cn/go.html"
          target="_blank"
          rel="noopener noreferrer"
          title="开往-友链接力"
          aria-label="开往-友链接力"
        >
          <Icon name="tram" size="h-5 w-5" />
        </a>
        <button :class="iconBtnClass" class="md:hidden" title="菜单" @click="mobileOpen = !mobileOpen">
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
        class="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-3xl border border-white/60 bg-white/90 p-2 shadow-soft-lg backdrop-blur-xl md:hidden dark:border-slate-700/60 dark:bg-slate-900/90"
      >
        <NuxtLink
          v-for="nav in navs"
          :key="nav.to"
          :to="nav.to"
          class="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm transition hover:bg-teal-50/70 dark:hover:bg-teal-900/30"
          :class="isActive(nav.to)
            ? 'font-semibold text-slate-900 dark:text-white'
            : 'font-medium text-slate-600 dark:text-slate-300'"
        >
          <component :is="nav.icon" v-if="typeof nav.icon !== 'string'" :size="16" :stroke="1.8" class="h-4 w-4" />
          <Icon v-else :name="nav.icon" size="h-4 w-4" />
          {{ nav.label }}
        </NuxtLink>
      </nav>
    </Transition>
  </header>

  <SearchPanel />
</template>
